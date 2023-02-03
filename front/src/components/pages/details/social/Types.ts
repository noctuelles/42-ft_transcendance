export enum EUserStatus {
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
	PLAYING = 'PLAYING',
}

export default interface IFriendData {
	id: number;
	name: string;
	status: EUserStatus;
	profile: {
		picture: string;
	};
}