import IUser from './IUser';

export default interface IChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	members: IUser[];
	membersId: number[];
	adminsId: number[];
}

export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}
