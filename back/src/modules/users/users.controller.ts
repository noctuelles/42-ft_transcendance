import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('profile/:userName')
	async getUserProfileData(@Param('userName') username: string) {
		return await this.usersService.fetchProfileData(username);
	}
}
