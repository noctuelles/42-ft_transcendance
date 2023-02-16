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
	muted: any;
	invitations: IChannelInvitation[];
}

export enum ChannelType {
	PUBLIC = 'PUBLIC',
	PROTECTED = 'PWD_PROTECTED',
	PRIVATE = 'PRIVATE',
	PRIVATE_MESSAGE = 'PRIVATE_MESSAGE',
}
