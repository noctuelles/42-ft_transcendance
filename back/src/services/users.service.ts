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
}
