import { LoggedUser } from '42.js/dist/structures/logged_user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
const fs = require('fs');

interface ICreatingUser {
    login: string;
    name: string;
    profile_picture: string;
}

@Injectable()
export class UsersService {
    private creatingUsers = [];

    constructor(private readonly prismaService: PrismaService) {}

    async isUserWithLogin(login: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                login: login,
            },
        });
        return user ? true : false;
    }

    async createUser(user42: LoggedUser) {
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
            profile_picture: `${process.env.SELF_URL}/cdn/user/${user42.login}`,
        };
        this.creatingUsers.push(user);
        return user;
    }
}
