import { IsOptional } from 'class-validator';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateUserDTO {
    login: string;
    name: string;
    @IsFile()
    @MaxFileSize(1e6)
    @IsOptional()
    profile_picture?: MemoryStoredFile;
}
