export default interface IUser {
	name: string;
	status: UserStatus;
	profile: { picture: string };
}

export enum UserStatus {
	OFFLINE,
	ONLINE,
	PLAYING,
}
