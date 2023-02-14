import {
	Controller,
	Get,
	Post,
	Param,
	UseGuards,
	Body,
	Patch,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/guards/currentUser.decorator';
import { UserDto } from './friend.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ChatService } from '../chat/chat.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private chatService: ChatService,
		private prismaService: PrismaService,
	) {}

	@Get('profile/:userName')
	@UseGuards(AuthGuard)
	async getUserProfileData(
		@CurrentUser() user,
		@Param('userName') username: string,
	) {
		return await this.usersService.fetchProfileData(user.id, username);
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
	async addFriend(@CurrentUser() user: User, @Body() addFriendDto: UserDto) {
		return await this.usersService.addFriend(user, addFriendDto.username);
	}

	@Patch('friends/remove')
	@UseGuards(AuthGuard)
	async removeFriend(
		@CurrentUser() user: User,
		@Body() removeFriendDto: UserDto,
	) {
		return await this.usersService.removeFriend(
			user,
			removeFriendDto.username,
		);
	}

	@Get('blocked')
	@UseGuards(AuthGuard)
	async getBlocked(@CurrentUser() user: User) {
		return await this.usersService.fetchBlockedList(user.id);
	}

	@Post('blocked/add')
	@UseGuards(AuthGuard)
	async addBlocked(@CurrentUser() user: User, @Body() userDto: UserDto) {
		const res = await this.usersService.addBlocked(user, userDto.username);
		this.chatService.sendChannelListToUserIds([
			user.id,
			res.find((u) => u.name === userDto.username).id,
		]);
		return res;
	}

	@Patch('blocked/remove')
	@UseGuards(AuthGuard)
	async removeBlocked(@CurrentUser() user: User, @Body() userDto: UserDto) {
		const res = await this.usersService.removeBlocked(
			user,
			userDto.username,
		);
		const unblocked = await this.prismaService.user.findUnique({
			where: {
				name: userDto.username,
			},
		});
		this.chatService.sendChannelListToUserIds([user.id, unblocked.id]);
		return res;
	}
}
