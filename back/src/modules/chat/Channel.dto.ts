import {
	IsNumber,
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	Length,
	isString,
	IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

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

export class ActionInChannelDTO {
	@IsNumber()
	channelId: number;
	@Type(() => Date)
	@IsDate()
	end: Date;
	@IsNumber()
	userId: number;
}

export class PromoteDTO {
	@IsNumber()
	channelId: number;
	@IsNumber()
	userId: number;
}

export class InviteDTO {
	@IsString()
	username: string;
}
