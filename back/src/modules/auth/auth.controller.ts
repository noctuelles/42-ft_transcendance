import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { Api42Service } from 'src/services/api42.service';
import { RefreshTokenDTO } from './DTO/RefreshTokenDTO';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly api42Service: Api42Service,
        private readonly authService: AuthService,
    ) {}

    @Get()
    async redirectToAuth() {
        return { url: (await this.api42Service.get_auth_processes()).url };
    }

    @Post('callback')
    async callback(@Query('code') code: string) {
        if (!code) {
            throw new BadRequestException('No code provided');
        }
        const user =
            await this.api42Service.client.auth_manager.response_auth_process(
                (
                    await this.api42Service.get_auth_processes()
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
}
