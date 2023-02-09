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
	protected readonly generateGroups? = () => {
		const groups = [];

		if (Object.values(EChannelType).includes(this.channelType))
			groups.push(this.channelType);

		return groups;
	};

	@Length(10, 25, {
		groups: [
			EChannelType.PUBLIC,
			EChannelType.PRIVATE,
			EChannelType.PWD_PROTECTED,
		],
	})
	channelName: string;

	@IsEnum(EChannelType, {
		groups: [
			EChannelType.PUBLIC,
			EChannelType.PRIVATE,
			EChannelType.PWD_PROTECTED,
		],
	})
	channelType: EChannelType;

	@Length(10, 25, { groups: [EChannelType.PWD_PROTECTED] })
	channelPassword: string;
}
