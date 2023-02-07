import {
	Controller,
	forwardRef,
	Get,
	Post,
	Inject,
	Param,
	UseGuards,
	Body,
	DefaultValuePipe,
} from '@nestjs/common';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/guards/currentUser.decorator';
import { AddFriendDto } from './add-friend.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

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

	@Get('friends')
	@UseGuards(AuthGuard)
	async getFriends(@CurrentUser() user: User) {
		return await this.usersService.fetchFriendList(user.id);
	}

	@Post('friends/add')
	@UseGuards(AuthGuard)
	async addFriend(
		@CurrentUser() user: User,
		@Body() addFriendDto: AddFriendDto,
	) {
		return await this.usersService.addFriend(user, addFriendDto.username);
	}
}
