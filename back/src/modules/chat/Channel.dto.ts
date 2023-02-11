import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';

export enum EChannelType {
	PUBLIC = 'Public',
	PRIVATE = 'Private',
	PWD_PROTECTED = 'Password Protected',
}

export class JoinChannelDTO {
	@IsNotEmpty()
	channelId: number;

	@IsOptional()
	password: string;
}

export class LeaveChannelDTO {
	@IsNotEmpty()
	channelId: number;
}

export class CreateChannelDTO {
	@Length(10, 25)
	channelName: string;

	@IsEnum(EChannelType)
	channelType: EChannelType;

	@IsOptional()
	@Length(10, 25)
	channelPassword: string | undefined;
}

export class ChangeChannelPwdDTO {
	@Length(10, 25)
	channelPassword: string;
}
