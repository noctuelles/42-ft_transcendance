export enum EUserStatus {
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
	PLAYING = 'PLAYING',
	MUTED = 'MUTED',
}

export default interface IUserData {
	id: number;
	name: string;
	status?: EUserStatus;
	profile: {
		picture: string;
	};
	blocked: boolean;
}
