/* When an interface is sufixed by "Data", this is coming from the back-end side of the application. */

interface UserProfileMatchData {
	picture: string;
	xp: number;
}

interface UserMatchData {
	name: string;
	profile: UserProfileMatchData;
}

export interface ProfileAchievementData {
	id: number;
	unlockedAt: string;
}

export interface ProfileMatchData {
	id: number;
	createdAt: string;
	finishedAt: string;
	bounces: number;
	userOne: UserMatchData;
	userTwo: UserMatchData;
	looser: UserMatchData;
}

export interface ProfileData {
	matches: ProfileMatchData[];
	achievements: ProfileAchievementData[];
	matchesCount: number;
	matchesWonCount: number;
	matchesLostCount: number;
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
