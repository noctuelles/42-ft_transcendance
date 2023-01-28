import {
	ProfileAchievement,
	ProfileDataTarget,
	AchievementId,
} from './ProfileTypes';
import NoviceBall from '@/assets/novice-ball.svg';
import JackOLanternBall from '@/assets/jack-o-lantern-ball.svg';
import DiscoBall from '@/assets/disco-ball.svg';
import RegularBall from '@/assets/regular-ball.svg';

export const AchievementMap = new Map<AchievementId, ProfileAchievement>([
	[
		AchievementId.ACH_NEW_SUBJECT,
		{
			title: 'New Subject',
			img: NoviceBall,
			description: 'Win your first match',
			earnings: 10,
			data: ProfileDataTarget.PROFILE_MATCH,
			threeshold: 1,
		},
	],
	[
		AchievementId.ACH_APPRENTICE_JUGGLER,
		{
			title: 'Apprentice Juggler',
			img: RegularBall,
			description: 'Play at least 10 match',
			earnings: 15,
			data: ProfileDataTarget.PROFILE_MATCH,
			threeshold: 10,
		},
	],
	[
		AchievementId.ACH_DAUTING_SUBJECT,
		{
			title: 'Dauting Subject',
			img: JackOLanternBall,
			description: 'Win at least 20 match',
			earnings: 42,
			data: ProfileDataTarget.PROFILE_MATCH_WON,
			threeshold: 20,
		},
	],
]);
