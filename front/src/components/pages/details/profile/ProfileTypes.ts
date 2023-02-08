/* When an interface is sufixed by "Data", this is coming from the back-end side of the application. */

export interface UserMatchData {
	score: number;
	xpAtBeg: number;
	xpEarned: number;
	eloAtBeg: number;
	eloEarned: number;
	winner: boolean;
	bounce: number;
	user: {
		name: string;
		profile: {
			picture: string;
		};
	};
}

export interface ProfileAchievementData {
	id: number;
	name: string;
	description: string;
	image: string;
	progress: number;
	objective: number;
	unlocked: boolean;
	unlockedAt: Date;
}

export interface ProfileMatchData {
	id: number;
	createdAt: string;
	finishedAt: string;
	userOne: UserMatchData;
	userTwo: UserMatchData;
	type: MatchType;
}

export enum UserStatus {
	OFFLINE = 'OFFLINE',
	ONLINE = 'ONLINE',
	PLAYING = 'PLAYING',
}

export interface ProfileData {
	id: number;
	matches: ProfileMatchData[];
	achievements: ProfileAchievementData[];
	wonMatches: number;
	lostMatches: number;
	picture: string;
	name: string;
	status: UserStatus;
	xp: number;
}

/* Other interfaces.. */

export enum ProfileDataTarget {
	PROFILE_MATCH,
	PROFILE_MATCH_WON,
}

export enum AchievementType {
	NewSubject = 'NEW_SUBJECT',
	ApprenticeJuggler = 'APPRENTICE_JUGGLER',
	DautingSubject = 'DAUTING_SUBJECT',
}

export enum MatchType {
	FUN = 'FUN',
	RANKED = 'RANKED',
}
