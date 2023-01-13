import { Controller, Get, Param, Req } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService) {}

	@Get('profile/:userLogin')
	findUser(@Param('userLogin') userLogin: string, @Req() req) {
		return req;
	}
}
