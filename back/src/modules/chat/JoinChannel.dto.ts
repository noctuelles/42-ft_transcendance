import { IsNotEmpty } from 'class-validator';

export class JoinChannelDTO {
	@IsNotEmpty()
	channelId: number;

	password: string | undefined;
}
