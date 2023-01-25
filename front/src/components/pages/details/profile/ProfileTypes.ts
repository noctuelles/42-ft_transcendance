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

export interface ProfileAchievement {
	achieveAt?: Date;
	img: string;
	description: string;
}
