import {
	BadRequestException,
	Body,
	Controller,
	Get, Param,
	Post,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
const fs = require('fs');

import { Api42Service } from 'src/services/api42.service';
import { CurrentUser } from './guards/currentUser.decorator';
import { RefreshTokenDTO } from './DTO/RefreshTokenDTO';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { User } from '@prisma/client';
import { UsersService } from 'src/services/users.service';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateUserDTO } from './DTO/CreateUserDTO';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly api42Service: Api42Service,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@Get()
	async redirectToAuth() {
		return { url: (await this.api42Service.get_auth_process()).url };
	}

	@Post('callback')
	async callback(@Query('code') code: string) {
		if (!code) {
			throw new BadRequestException('No code provided');
		}
		const user =
			await this.api42Service.client.auth_manager.response_auth_process(
				(
					await this.api42Service.get_auth_process()
				).id,
				code,
		);
		if (!user) {
			throw new BadRequestException('No user found on 42 intranet');
		}
		return await this.authService.connectUser(user);
	}

	@Post('refresh')
	async refresh(
		@Body(new ValidationPipe()) refresh_tokenDTO: RefreshTokenDTO,
	) {
		const refreshToken = refresh_tokenDTO.refresh_token;
		if (!refreshToken) {
			throw new BadRequestException('No refresh token provided');
		}
		return await this.authService.refresh(refreshToken);
	}

	@Get('name/:name')
	async testName(@Param('name') name: string) {
		if (name.length < 3)
			return {
				valid: false,
				reason: 'The name must be at least 3 characters long',
			};
			if (name.length > 20)
				return {
					valid: false,
					reason: 'The name must be at most 20 characters long',
				};
				if (await this.usersService.isUserWithName(name)) {
					return {
						valid: false,
						reason: 'The name is already taken',
					};
				}
				return {
					valid: true,
				};
	}

	@Post('create')
	@FormDataRequest()
	async createUser(@Body(new ValidationPipe()) user: CreateUserDTO) {
		return await this.authService.validUser(user);
	}

	@Get('test')
	@UseGuards(AuthGuard)
	test(@CurrentUser() user: User) {
		return 'Hey ' + user.login;
	}
}
