export default interface IChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	membersId: number[];
	adminsId: number[];
}

export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}
