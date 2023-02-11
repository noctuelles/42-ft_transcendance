import IUser from './IUser';

export default interface IChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	members: IUser[];
	membersId: number[];
	adminsId: number[];
	unreaded: number;
}

export enum ChannelType {
	PUBLIC = 'PUBLIC',
	PROTECTED = 'PROTECTED',
	PRIVATE = 'PRIVATE',
	PRIVATE_MESSAGE = 'PRIVATE_MESSAGE',
}
