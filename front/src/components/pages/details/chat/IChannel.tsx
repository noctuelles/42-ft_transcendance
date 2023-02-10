export default interface IChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	membersId: number[];
	adminsId: number[];
	unreaded: number;
}

export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}
