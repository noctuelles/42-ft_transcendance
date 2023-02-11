import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidUser } from './users.service';

export class UserDto {
	@IsNotEmpty()
	@IsString()
	@IsValidUser()
	username: string;
}
