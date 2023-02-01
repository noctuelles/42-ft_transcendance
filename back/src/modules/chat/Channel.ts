export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}

export interface IPunishment {
	userId: number;
	endDate: Date;
}

export interface IMessage {
	channel: number;
	username: string;
	message: string;
}

export default class Channel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	membersId: number[];
	adminsId: number[];
	muted: IPunishment[];
	banned: IPunishment[];
	constructor(id: number, name: string, type: ChannelType, ownerId: number) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.ownerId = ownerId;
		this.membersId = [ownerId];
		this.adminsId = [ownerId];
		this.muted = [];
		this.banned = [];
	}

	canUserSendMessage(userId: number): boolean {
		return this.containsUser(userId);
	}

	containsUser(userId: number): boolean {
		return this.membersId.includes(userId);
	}

	addUser(userId: number): boolean {
		if (this.containsUser(userId)) {
			return false;
		}
		this.membersId.push(userId);
		return true;
	}

	canUserJoin(userId: number, password: string): boolean {
		if (this.type === ChannelType.PRIVATE) {
			return false;
		}
		if (this.isUserBanned(userId)) {
			return false;
		}
		// TODO: Check password
		return true;
	}

	isUserBanned(userId: number): boolean {
		return this.banned.some((bannedInfos) => {
			bannedInfos.userId === userId;
		});
	}
}
