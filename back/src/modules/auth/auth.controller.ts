import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Query,
    Res,
} from '@nestjs/common';
import { Api42Service } from 'src/services/api42.service';
import { PrismaService } from 'src/services/prisma.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly api42Service: Api42Service) {}

    @Get()
    async redirectToAuth(@Res() res) {
        res.redirect((await this.api42Service.get_auth_processes()).url);
    }

    @Get('callback')
    async callback(@Query('code') code: string, @Res() res) {
        if (!code) {
            //TODO Redirect to front with error
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
            //TODO Redirect to front with error
            throw new NotFoundException('User not found on 42 intranet');
        }
        res.redirect(process.env.FRONT_URL);
    }
}
