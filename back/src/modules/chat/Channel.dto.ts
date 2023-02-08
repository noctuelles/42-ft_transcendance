import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	Length,
	Matches,
} from 'class-validator';

enum EChannelType {
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
	@Matches('^[a-zA-Z]+(?: [a-zA-Z]+)*$')
	channelName: string;

	@IsEnum(EChannelType)
	channelType: string;

	@Length(10, 25, { groups: ['pwd-prot'] })
	@Matches('[A-Za-z0-9_@./#&+-]*$', null, { groups: ['pwd-prot'] })
	channelPassword: string | undefined;
}
