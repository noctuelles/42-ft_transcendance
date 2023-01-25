import { LoggedUser } from '42.js/dist/structures/logged_user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/modules/auth/DTO/CreateUserDTO';
import { PrismaService } from '../prisma/prisma.service';
const fs = require('fs');

interface ICreatingUser {
	login: string;
	name: string;
	profile_picture: string;
}

@Injectable()
export class UsersService {
	private creatingUsers: ICreatingUser[] = [];

	constructor(private readonly prismaService: PrismaService) {}

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
			profile_picture: `${process.env.SELF_URL}/cdn/user/${user42.login}.jpg`,
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
		return await this.prismaService.user.create({
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
	}

	//TODO: Remove this function
	async createDevUser(name: string) {
		await this.prismaService.user.create({
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
		});
	}
}
