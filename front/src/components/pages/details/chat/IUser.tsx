import { EUserStatus } from '../social/Types';

export default interface IUser {
	name: string;
	status: EUserStatus;
	profile: { picture: string };
}
