import {
	Controller,
	forwardRef,
	Get,
	Inject,
	Param,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/guards/currentUser.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('profile/:userName')
	async getUserProfileData(@Param('userName') username: string) {
		return await this.usersService.fetchProfileData(username);
	}

	@Get('ranking/global')
	@UseGuards(AuthGuard)
	async getUserRanking() {
		return await this.usersService.fetchRanking();
	}

	@Get('ranking/friends')
	@UseGuards(AuthGuard)
	async getUserFriendsRanking(@CurrentUser() user) {
		return await this.usersService.fetchFriendsRanking(user);
	}

	@Get('friends/:userName')
	async getUserFriendList(@Param('userName') username: string) {
		return await this.usersService.fetchFriendList(username);
	}
}
