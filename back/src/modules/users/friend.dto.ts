import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsValidUser, UserExistsRule } from './users.service';

export class FriendDto {
	@IsNotEmpty()
	@IsString()
	@IsValidUser()
	username: string;
}
