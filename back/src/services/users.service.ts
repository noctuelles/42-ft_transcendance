import { LoggedUser } from '42.js/dist/structures/logged_user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/modules/auth/DTO/CreateUserDTO';
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

    async isUserWithName(name: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                name: name,
            },
        });
        console.log('This user exist', user);
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
            profile_picture: `${process.env.SELF_URL}/cdn/user/${user42.login}.jpg`,
        };
        this.creatingUsers.push(user);
        return user;
    }

    async validUser(user: CreateUserDTO) {
        if (
            this.creatingUsers.filter((u) => u.login === user.login).length == 0
        )
            throw new BadRequestException('User not found');
        if (user.profile_picture) {
            fs.writeFile(
                `./public/cdn/profile_pictures/${user.login}.jpg`,
                user.profile_picture.buffer,
                () => {},
            );
        }
        await this.prismaService.user.create({
            data: {
                login: user.login,
                name: user.name,
                profile_picture: `${process.env.SELF_URL}/cdn/user/${user.login}.jpg`,
            },
        });
    }
}
