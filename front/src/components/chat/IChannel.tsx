export default interface IChannel {
	id: number;
	name: string;
	type: ChannelType;
	owner_id: number;
	members: number[];
}

export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}
