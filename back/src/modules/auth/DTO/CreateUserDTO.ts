import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateUserDTO {
	@IsString()
	@MinLength(1)
	@MaxLength(9)
	login: string;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	name: string;

	@IsFile()
	@MaxFileSize(1e6)
	@IsOptional()
	profile_picture?: MemoryStoredFile;
}
