export enum InvitationStatus {
	PENDING = 'PENDING',
	ACCEPTED = 'ACCEPTED',
	PLAYING = 'PLAYING',
	FINISHED = 'FINISHED',
}

export default interface IMessage {
	username: string;
	channel: number;
	message: string;
	isInvitation: boolean;
	invitationStatus?: InvitationStatus;
}
