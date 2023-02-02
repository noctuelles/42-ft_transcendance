import {
	ProfileAchievement,
	ProfileDataTarget,
	AchievementType,
} from './ProfileTypes';
import NoviceBallIcon from '@/assets/novice-ball.svg';
import JackOLanternBallIcon from '@/assets/jack-o-lantern-ball.svg';
import DiscoBallIcon from '@/assets/disco-ball.svg';
import RegularBallIcon from '@/assets/regular-ball.svg';

export const AchievementMap = new Map<AchievementType, ProfileAchievement>([
	[
		AchievementType.NewSubject,
		{
			title: 'New Subject',
			img: NoviceBallIcon,
			description: 'Win your first match',
			earnings: 10,
			data: ProfileDataTarget.PROFILE_MATCH,
			threeshold: 1,
		},
	],
	[
		AchievementType.ApprenticeJuggler,
		{
			title: 'Apprentice Juggler',
			img: RegularBallIcon,
			description: 'Play at least 10 match',
			earnings: 15,
			data: ProfileDataTarget.PROFILE_MATCH,
			threeshold: 10,
		},
	],
	[
		AchievementType.DautingSubject,
		{
			title: 'Dauting Subject',
			img: JackOLanternBallIcon,
			description: 'Win at least 20 match',
			earnings: 42,
			data: ProfileDataTarget.PROFILE_MATCH_WON,
			threeshold: 20,
		},
	],
]);
