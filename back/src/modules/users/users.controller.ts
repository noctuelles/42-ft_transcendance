import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private prisma: PrismaService,
	) {}

	@Get('profile/:userLogin')
	getUser(@Param('userLogin') userLogin: string) {
		return userLogin;
	}
}
