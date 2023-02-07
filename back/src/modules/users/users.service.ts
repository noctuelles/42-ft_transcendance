import { LoggedUser } from '42.js/dist/structures/logged_user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/modules/auth/DTO/CreateUserDTO';
import { PrismaService } from '../prisma/prisma.service';
import { achievmentsList } from './achievments.interface';
import { AchievementsService } from './achievments.service';
const fs = require('fs');

interface ICreatingUser {
	login: string;
	name: string;
	profile_picture: string;
}

@Injectable()
export class UsersService {
	private creatingUsers: ICreatingUser[] = [];

	constructor(
		private readonly prismaService: PrismaService,
		private readonly achievmentsService: AchievementsService,
	) {}

	async isUserWithLogin(login: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				login: login,
			},
		});
		return user ? true : false;
	}

	async isUserWithName(name: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				name: name,
			},
		});
		return user ? true : false;
	}

	/*
	 ** Function called when the user is not in the database
	 ** We create a temporary user with the login and the profile picture
	 ** This user will be deleted if the user doesn't create his account
	 */
	async initUser(user42: LoggedUser) {
		const response = await fetch(user42.image.link);
		const blob = await response.blob();
		const arrayBuffer = await blob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.writeFile(
			`./public/cdn/profile_pictures/${user42.login}.jpg`,
			buffer,
			() => {},
		);
		const user = {
			login: user42.login,
			name: user42.login,
			profile_picture: user42.image.link,
		};
		this.creatingUsers.push(user);
		return user;
	}

	/*
	 ** Function called when the user has choosed his name and pp
	 ** Create the user in the database definitively
	 */
	async createUser(user: CreateUserDTO) {
		if (
			this.creatingUsers.filter((u) => u.login === user.login).length == 0
		)
			throw new BadRequestException('User not found');
		this.creatingUsers = this.creatingUsers.filter(
			(u) => u.login !== user.login,
		);
		if (user.profile_picture) {
			const path = `./public/cdn/profile_pictures`;
			if (!fs.existsSync(path)) {
				fs.mkdirSync('path');
			}
			fs.writeFile(
				`${path}/${user.login}.jpg`,
				user.profile_picture.buffer,
				() => {},
			);
		}
		const createdUser = await this.prismaService.user.create({
			data: {
				login: user.login,
				name: user.name,
				profile: {
					create: {
						picture: `${process.env.SELF_URL}/cdn/user/${user.login}.jpg`,
					},
				},
			},
			include: {
				profile: true,
			},
		});
		this.achievmentsService.initAchievements(createdUser.profile.id);
		return createdUser;
	}

	//TODO: Remove this function
	async createDevUser(name: string) {
		const user = await this.prismaService.user.create({
			data: {
				login: name,
				name: name,
				profile: {
					create: {
						picture:
							'https://cdn.discordapp.com/attachments/1052674310034182196/1064564672122077204/turret.png',
					},
				},
			},
			include: {
				profile: true,
			},
		});
		this.achievmentsService.initAchievements(user.profile.id);
	}

	async fetchFriendList(username: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				name: username,
			},
			select: {
				friends: {
					select: {
						id: true,
						name: true,
						status: true,
						profile: {
							select: {
								picture: true,
							},
						},
					},
				},
			},
		});

		return user.friends;
	}

	//TODO: AuthGuard.
	/* Fetch a profile of a specified username zer*/
	async fetchProfileData(username: string) {
		const opt = {
			include: {
				userOne: {
					include: {
						user: {
							select: {
								name: true,
								profile: {
									select: {
										picture: true,
									},
								},
							},
						},
					},
				},
				userTwo: {
					include: {
						user: {
							select: {
								name: true,
								profile: {
									select: {
										picture: true,
									},
								},
							},
						},
					},
				},
			},
		};

		const user = await this.prismaService.user.findUnique({
			where: {
				name: username,
			},
			include: {
				matches: {
					include: {
						asUserOne: {
							...opt,
						},
						asUserTwo: {
							...opt,
						},
					},
				},
				profile: {
					select: {
						xp: true,
						lostMatches: true,
						wonMatches: true,
						picture: true,
						achievements: true,
					},
				},
			},
		});

		user.profile.wonMatches;
		if (!user) return null;
		const achievements = user.profile.achievements
			.map((a) => {
				const achievement = this.achievmentsService.getAchievment(
					a.type,
				);
				return {
					id: a.id,
					name: achievement.name,
					description: achievement.description,
					image: achievement.image,
					progress: a.bestProgress,
					objective: achievement.neededProgress,
					unlocked: a.unlocked,
					unlockedAt: a.unlockedAt,
					type: a.type,
				};
			})
			.sort(
				(a, b) =>
					achievmentsList.indexOf(
						this.achievmentsService.getAchievment(a.type),
					) -
					achievmentsList.indexOf(
						this.achievmentsService.getAchievment(b.type),
					),
			);

		return {
			matches: user.matches.map((match) =>
				match.asUserOne ? match?.asUserOne : match?.asUserTwo,
			),
			name: user.name,
			...user.profile,
			achievements,
		};
	}

	async fetchRanking() {
		const dbUsers = await this.prismaService.user.findMany({
			include: {
				profile: {
					select: {
						xp: true,
						picture: true,
						elo: true,
					},
				},
			},
		});
		let users = dbUsers.map((user) => ({
			id: user.id,
			name: user.name,
			picture: user.profile.picture,
			xp: user.profile.xp,
			elo: user.profile.elo,
		}));
		return users.sort((a, b) => b.elo - a.elo);
		return users;
	}

	async fetchFriendsRanking(user) {
		const searcher = await this.prismaService.user.findUnique({
			where: {
				id: user.id,
			},
			include: {
				friends: true,
				profile: {
					select: {
						xp: true,
						picture: true,
						elo: true,
					},
				},
			},
		});
		let dbUsers = await this.prismaService.user.findMany({
			where: {
				id: {
					in: searcher.friends.map((f) => f.id),
				},
			},
			include: {
				profile: {
					select: {
						xp: true,
						picture: true,
						elo: true,
					},
				},
			},
		});
		dbUsers.push(searcher);
		let users = dbUsers.map((user) => ({
			id: user.id,
			name: user.name,
			picture: user.profile.picture,
			xp: user.profile.xp,
			elo: user.profile.elo,
		}));
		users.sort((a, b) => b.elo - a.elo);
		return users;
	}
}
