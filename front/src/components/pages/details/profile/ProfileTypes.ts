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
	type: AchievementType;
	unlockedAt: string;
}

export interface ProfileMatchData {
	id: number;
	createdAt: string;
	finishedAt: string;
	userOne: UserMatchData;
	userTwo: UserMatchData;
	type: MatchType;
}

export interface ProfileData {
	matches: ProfileMatchData[];
	achievements: ProfileAchievementData[];
	wonMatches: number;
	lostMatches: number;
	picture: string;
	name: string;
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

export interface ProfileAchievement {
	achieveAt?: Date;
	title: string;
	img: object;
	description: string;
	earnings: number;
	data: ProfileDataTarget;
	threeshold: number;
}
