import { LoggedUser } from '42.js/dist/structures/logged_user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class UsersService {
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
        await this.prismaService.user.create({
            data: {
                login: user42.login,
                name: user42.login,
                profile_picture: user42.image.link,
            },
        });
    }
}
