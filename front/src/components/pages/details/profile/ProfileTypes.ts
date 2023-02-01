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

export enum AchievementId {
	ACH_NEW_SUBJECT = 1,
	ACH_APPRENTICE_JUGGLER,
	ACH_DAUTING_SUBJECT,
}

export const AchievementIdArray = [
	AchievementId.ACH_NEW_SUBJECT,
	AchievementId.ACH_APPRENTICE_JUGGLER,
	AchievementId.ACH_DAUTING_SUBJECT,
];

export enum MatchType {
	FUN = 'FUN',
	RANKED = 'RANKED',
}

export type AchievementIdValue = `${AchievementId}`;

export interface ProfileAchievement {
	achieveAt?: Date;
	title: string;
	img: object;
	description: string;
	earnings: number;
	data: ProfileDataTarget;
	threeshold: number;
}
