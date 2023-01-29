import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
const fs = require('fs');

import { Api42Service } from './api42.service';
import { CurrentUser } from './guards/currentUser.decorator';
import { RefreshTokenDTO } from './DTO/RefreshTokenDTO';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { TwoFaLogDTO } from './DTO/TwoFALogDTO';
import { TwoFAService } from './TwoFA.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly api42Service: Api42Service,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		private readonly twoFAService: TwoFAService,
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

	//TODO: Remove this route
	@Post('dev/:name')
	async dev(@Param('name') name: string) {
		return await this.authService.dev(name);
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
		return await this.authService.createUser(user);
	}

	@Get('test')
	@UseGuards(AuthGuard)
	test(@CurrentUser() user: User) {
		return 'Hey ' + user.login;
	}

	@Post('2fa/enable')
	@UseGuards(AuthGuard)
	async enable2FA(@CurrentUser() user) {
		return await this.twoFAService.enable2FA(user);
	}

	@Post('2fa/verify')
	@UseGuards(AuthGuard)
	async verify2FA(@CurrentUser() user, @Body('code') code: string) {
		return await this.twoFAService.verify2FA(user, code);
	}

	@Post('2fa/connect')
	async connect2FA(@Body(new ValidationPipe()) body: TwoFaLogDTO) {
		const { token, code } = body;
		return await this.authService.connect2FA(token, code);
	}

	@Post('2fa/disable')
	@UseGuards(AuthGuard)
	async disable2FA(@CurrentUser() user) {
		return await this.twoFAService.disable2FA(user);
	}
}
