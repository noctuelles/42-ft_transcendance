import { LoggedUser } from '42.js/dist/structures/logged_user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from '@prisma/client';
import { UsersService } from 'src/services/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async connectUser(user42: LoggedUser) {
        if (!(await this.userService.isUserWithLogin(user42.login))) {
            await this.userService.createUser(user42);
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                login: user42.login,
            },
        });
        if (!user) throw new Error('User not found');
        return {
            access_token: {
                token: this.generateAccessToken(user),
                expires_in: '180s',
            },
            refresh_token: {
                token: this.generateRefreshToken(user),
                expires_in: '7d',
            },
        };
    }

    generateAccessToken(user: User): String {
        return this.jwtService.sign({
            type: 'access',
            user: {
                id: user.id,
                login: user.login,
                name: user.name,
            },
        });
    }

    generateRefreshToken(user: User): String {
        return this.jwtService.sign(
            {
                type: 'refresh',
                user: {
                    id: user.id,
                },
            },
            { expiresIn: '7d' },
        );
    }
}
