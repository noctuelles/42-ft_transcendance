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
		return (
			this.containsUser(userId) &&
			!this.isUserMuted(userId) &&
			!this.isUserBanned(userId)
		);
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
		this.purgeEndedPunishment(this.banned);
		return this.banned.some((bannedInfos) => {
			return bannedInfos.userId === userId;
		});
	}

	isUserMuted(userId: number) {
		this.purgeEndedPunishment(this.muted);
		return this.muted.some((mutedInfos) => {
			return mutedInfos.userId === userId;
		});
	}

	purgeEndedPunishment(punishments: IPunishment[]) {
		this.removeAllMatches(punishments, (punishment) => {
			return punishment.endDate < new Date(Date.now());
		});
	}

	ban(userId: number, unbanDate: Date): void {
		if (this.isUserBanned(userId)) {
			this.pardon(userId);
		}
		this.banned.push({ userId: userId, endDate: unbanDate });
	}

	pardon(userId: number): boolean {
		return this.removeAllMatches(this.banned, (punishment) => {
			return punishment.userId === userId;
		});
	}

	mute(userId: number, unmuteDate: Date): void {
		if (this.isUserMuted(userId)) {
			this.unmute(userId);
		}
		this.muted.push({ userId: userId, endDate: unmuteDate });
	}

	unmute(userId: number): boolean {
		return this.removeAllMatches(this.muted, (punishment) => {
			return punishment.userId === userId;
		});
	}

	removeAllMatches(array: any[], condition: (elem: any) => boolean): boolean {
		let didMatch = false;
		for (let i = array.length - 1; i >= 0; i--) {
			if (condition(array[i])) {
				didMatch = true;
				array.splice(i, 1);
			}
		}
		return didMatch;
	}
}
