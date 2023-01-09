import {
    BadRequestException,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { Api42Service } from 'src/services/api42.service';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly api42Service: Api42Service,
        private readonly authService: AuthService,
    ) {}

    @Get()
    async redirectToAuth(): Promise<string> {
        return (await this.api42Service.get_auth_processes()).url;
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
            throw new BadRequestException('No code provided');
        }
        this.authService.connectUser(user);
        return {
            message: 'User connected',
        };
    }
}
