import { EUserStatus } from '../social/Types';

export default interface IUser {
	id: number;
	name: string;
	status: EUserStatus;
	profile: { picture: string };
}
