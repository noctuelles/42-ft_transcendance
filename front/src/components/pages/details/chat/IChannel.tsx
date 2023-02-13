import IUser from './IUser';

export default interface IChannelInvitation {
	userId: number;
	username: string;
	picture: string;
}

export default interface IChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	members: IUser[];
	membersId: number[];
	adminsId: number[];
	unreaded: number;
	invitations: IChannelInvitation[];
}

export enum ChannelType {
	PUBLIC = 'PUBLIC',
	PROTECTED = 'PROTECTED',
	PRIVATE = 'PRIVATE',
	PRIVATE_MESSAGE = 'PRIVATE_MESSAGE',
}
