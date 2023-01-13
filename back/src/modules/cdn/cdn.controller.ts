import { Controller, Get, Param, Res } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';

@Controller('cdn')
export class CdnController {
    constructor(private readonly userService: UsersService) {}

    @Get('user/:userLogin')
    async user(@Param('userLogin') userLogin: string, @Res() res) {
        const imgPath = `./cdn/profile_pictures/${userLogin}`;
        return res.sendFile(imgPath, { root: 'public' });
    }
}
