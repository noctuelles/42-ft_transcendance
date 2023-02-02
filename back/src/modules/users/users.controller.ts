import {
	Controller,
	forwardRef,
	Get,
	Inject,
	Param,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('profile/:userName')
	async getUserProfileData(@Param('userName') username: string) {
		return await this.usersService.fetchProfileData(username);
	}

	@Get('ranking')
	@UseGuards(AuthGuard)
	async getUserRanking() {
		return await this.usersService.fetchRanking();
	}
}
