import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { UserExistsRule } from './users.service';

export class FriendDto {
	@IsNotEmpty()
	@IsString()
	@Validate(UserExistsRule)
	username: string;
}
