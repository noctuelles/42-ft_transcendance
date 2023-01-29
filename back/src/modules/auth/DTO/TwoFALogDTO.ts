import { IsString, Length, MinLength } from 'class-validator';

export class TwoFaLogDTO {
	@IsString()
	@MinLength(1)
	token: string;

	@IsString()
	@Length(6, 6)
	code: string;
}
