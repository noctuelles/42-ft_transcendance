import { LoggedUser } from '42.js/dist/structures/logged_user';
import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { Prisma } from '@prisma/client';
import { TwoFAService } from './TwoFA.service';
import { GameService } from '../game/game.service';
var crypto = require('crypto');

type UserWithProfile = Prisma.UserGetPayload<{
	include: {
		profile: true;
	};
}>;

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly twoFAService: TwoFAService,
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
	) {}

	/*
	 ** Function called when 42 redirect the user to the callback url
	 ** If the user is not in the database, we call the function to init it
	 ** Else we generate the tokens and return them
	 */
	async connectUser(user42: LoggedUser) {
		if (!(await this.userService.isUserWithLogin(user42.login))) {
			const user = await this.userService.initUser(user42);
			return {
				state: 'creating',
				user: user,
			};
		}
		const user = await this.prismaService.user.findUnique({
			where: {
				login: user42.login,
			},
			include: {
				profile: true,
			},
		});
		if (!user) throw new BadRequestException('User not found');
		if (user.otpSecret) {
			const token = this.jwtService.sign({ user: user.id });
			return {
				state: '2fa',
				token: token,
			};
		}
		const tokens = await this.generateTokens(user);
		return {
			state: 'connected',
			tokens: tokens,
		};
	}

	async connect2FA(token: string, code: string) {
		try {
			const decoded = this.jwtService.verify(token);
			if (!decoded || !decoded.user)
				throw new BadRequestException('Invalid token');
			const user = await this.prismaService.user.findUnique({
				where: {
					id: decoded.user,
				},
				include: {
					profile: true,
				},
			});
			if (!user) throw new BadRequestException('User not found');
			if (!(await this.twoFAService.connect(user, code))) {
				return {
					state: 'error',
				};
			}
			const tokens = await this.generateTokens(user);
			return {
				state: 'connected',
				tokens: tokens,
			};
		} catch (err) {
			throw new BadRequestException('Invalid token');
		}
	}

	/*
	 ** Function called when the users has choosed his name and pp
	 ** We create the user in the database and generate the tokens
	 */
	async createUser(user: CreateUserDTO) {
		const finalUser = await this.userService.createUser(user);
		if (!user) throw new BadRequestException('User not found');
		const tokens = await this.generateTokens(finalUser);
		return {
			state: 'connected',
			tokens: tokens,
		};
	}

	async refresh(refreshToken: string) {
		try {
			const token = this.jwtService.verify(refreshToken);
			if (
				!token.type ||
				!token.user ||
				!token.identifier ||
				token.type !== 'refresh'
			) {
				throw new BadRequestException('Invalid refresh token');
			}
			const identifier =
				await this.prismaService.authIdentifier.findUnique({
					where: {
						identifier: token.identifier,
					},
				});
			if (!identifier) {
				await this.prismaService.authIdentifier.deleteMany({
					where: {
						userId: token.user.id,
					},
				});
				throw new BadRequestException('Invalid refresh token');
			}
			setTimeout(async () => {
				if (
					await this.prismaService.authIdentifier.findUnique({
						where: {
							identifier: token.identifier,
						},
					})
				) {
					await this.prismaService.authIdentifier.deleteMany({
						where: {
							identifier: token.identifier,
						},
					});
				}
			}, 1000 * 2);
			const user = await this.prismaService.user.findUnique({
				where: {
					id: token.user.id,
				},
				include: {
					profile: true,
				},
			});
			if (!user) throw new BadRequestException('User not found');
			return await this.generateTokens(user);
		} catch (e) {
			throw new BadRequestException('Invalid refresh token');
		}
	}

	async generateTokens(user: UserWithProfile) {
		const access_token = this.generateAccessToken(user);
		const new_refresh_token = await this.generateRefreshToken(user);
		return {
			access_token: {
				token: access_token,
				expires_in: '180s',
			},
			refresh_token: {
				token: new_refresh_token,
				expires_in: '7d',
			},
		};
	}

	generateAccessToken(user: UserWithProfile) {
		return this.jwtService.sign({
			type: 'access',
			user: {
				id: user.id,
				name: user.name,
				profile_picture: user.profile.picture,
			},
		});
	}

	async generateRefreshToken(user: UserWithProfile) {
		const identifier = crypto.randomUUID();
		await this.prismaService.authIdentifier.create({
			data: {
				userId: user.id,
				identifier: identifier,
			},
		});
		return this.jwtService.sign(
			{
				type: 'refresh',
				identifier: identifier,
				user: {
					id: user.id,
				},
			},
			{ expiresIn: '7d' },
		);
	}

	async verifyAccessToken(token: string): Promise<User> {
		try {
			const decoded = this.jwtService.verify(token);
			if (!decoded.type || !decoded.user || decoded.type !== 'access') {
				throw new BadRequestException('Invalid access token');
			}
			return await this.prismaService.user.findUnique({
				where: {
					id: decoded.user.id,
				},
			});
		} catch (e) {
			throw new BadRequestException('Invalid access token');
		}
	}

	async logout(refreshToken: string) {
		try {
			const decode = this.jwtService.verify(refreshToken);
			if (
				!decode ||
				!decode.type ||
				decode.type !== 'refresh' ||
				!decode.identifier
			) {
				throw new BadRequestException('Invalid refresh token');
			}
			this.gameService.leaveGameById(decode.user.id);
			await Promise.all([
				this.prismaService.authIdentifier.deleteMany({
					where: {
						identifier: decode.identifier,
					},
				}),
				this.prismaService.user.update({
					where: {
						id: decode.user.id,
					},
					data: {
						status: 'OFFLINE',
					},
				}),
			]);
		} catch (e) {
			throw new BadRequestException('Invalid refresh token');
		}
	}
}
