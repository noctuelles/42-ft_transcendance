export default interface IChannel {
	id: number;
	name: string;
	type: ChannelType;
	owner_id: number;
	members: IChannelUser[];
}

export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}

interface IChannelUser {
	id: number;
	isAdmin: boolean;
	unmuteDate: Date;
	unbanDate: Date;
}
