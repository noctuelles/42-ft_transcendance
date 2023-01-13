import { LoggedUser } from '42.js/dist/structures/logged_user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from '@prisma/client';
import { UsersService } from 'src/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../DTO/CreateUserDTO';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
	) {}

	async connectUser(user42: LoggedUser) {
		if (!(await this.userService.isUserWithLogin(user42.login))) {
			const user = await this.userService.createUser(user42);
			return {
				state: 'creating',
				user: user,
			};
		}
		const user = await this.prismaService.user.findUnique({
			where: {
				login: user42.login,
			},
		});
		if (!user) throw new BadRequestException('User not found');
		const tokens = await this.generateTokens(user);
		return {
			state: 'connected',
			tokens: tokens,
		};
	}

	async validUser(user: CreateUserDTO) {
		await this.userService.validUser(user);
		const finalUser = await this.prismaService.user.findUnique({
			where: {
				login: user.login,
			},
		});
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
			await this.prismaService.authIdentifier.delete({
				where: {
					identifier: token.identifier,
				},
			});
			const user = await this.prismaService.user.findUnique({
				where: {
					id: token.user.id,
				},
			});
			if (!user) throw new BadRequestException('User not found');
			return await this.generateTokens(user);
		} catch (e) {
			throw new BadRequestException('Invalid refresh token');
		}
	}

	async generateTokens(user: User) {
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

	generateAccessToken(user: User) {
		return this.jwtService.sign({
			type: 'access',
			user: {
				id: user.id,
				name: user.name,
				profile_picture: user.profile_picture,
			},
		});
	}

	async generateRefreshToken(user: User) {
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
}
