import {
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import {
	HasMimeType,
	IsFile,
	MaxFileSize,
	MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateUserDTO {
	@IsString()
	@MinLength(1)
	@MaxLength(8)
	login: string;

	@IsString()
	@Matches('^[a-zA-Z0-9_]*$')
	@MinLength(3)
	@MaxLength(20)
	name: string;

	@IsFile()
	@MaxFileSize(1e6)
	@HasMimeType(['image/jpeg'])
	@IsOptional()
	profile_picture?: MemoryStoredFile;
}
