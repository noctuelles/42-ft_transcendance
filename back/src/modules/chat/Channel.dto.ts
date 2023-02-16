import {
	IsNumber,
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	Length,
	isString,
	IsString,
	matches,
	Matches,
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
	@Length(3, 10)
	@Matches(RegExp('^[a-zA-Z]+(?: [a-zA-Z]+)*$'), {
		message: 'Invalid channel name',
	})
	channelName: string;

	@IsEnum(EChannelType)
	channelType: EChannelType;

	@IsOptional()
	@Length(3, 25)
	@Matches(RegExp('^[A-Za-z0-9_@./#&+-]*$'), {
		message: 'Invalid channel password',
	})
	channelPassword: string | undefined;
}

export class ChangeChannelPwdDTO {
	@Length(0, 25)
	@Matches(RegExp('^[A-Za-z0-9_@./#&+-]*$'), {
		message: 'Invalid channel password',
	})
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
