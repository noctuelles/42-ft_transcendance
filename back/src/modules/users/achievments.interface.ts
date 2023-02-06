import { AchievementType } from '@prisma/client';

export interface IAchievement {
	type: AchievementType;
	name: string;
	description: string;
	image: string;
	neededProgress: number;
	xpEarned: number;
	defaultProgress?: number;
}

function generateAchievmentCdnUrl(imageName: string) {
	return `${process.env.SELF_URL}/cdn/achievments/${imageName}`;
}

export const achievmentsList: IAchievement[] = [
	{
		type: AchievementType.NEW_SUBJECT,
		name: 'New Subject',
		description: 'Win your first game',
		image: generateAchievmentCdnUrl('new_subject.svg'),
		neededProgress: 1,
		xpEarned: 25,
	},
	{
		type: AchievementType.WHEATLEY,
		name: 'Wheatley',
		description: 'Play 20 games',
		image: generateAchievmentCdnUrl('wheatley.svg'),
		neededProgress: 20,
		xpEarned: 100,
	},
	{
		type: AchievementType.P_BODY,
		name: 'P-Body',
		description: 'Play 50 games',
		image: generateAchievmentCdnUrl('p_body.svg'),
		neededProgress: 50,
		xpEarned: 300,
	},
	{
		type: AchievementType.GLADOS,
		name: 'GLaDOS',
		description: 'Play 100 games',
		image: generateAchievmentCdnUrl('glados.svg'),
		neededProgress: 100,
		xpEarned: 500,
	},
	{
		type: AchievementType.APPRENTICE,
		name: 'Apprentice',
		description: 'Win 10 games',
		image: generateAchievmentCdnUrl('apprentice.svg'),
		neededProgress: 10,
		xpEarned: 150,
	},
	{
		type: AchievementType.LEARNER,
		name: 'Learner',
		description: 'Win 25 games',
		image: generateAchievmentCdnUrl('learner.svg'),
		neededProgress: 25,
		xpEarned: 300,
	},
	{
		type: AchievementType.EXPERT,
		name: 'Expert',
		description: 'Win 50 games',
		image: generateAchievmentCdnUrl('expert.svg'),
		neededProgress: 50,
		xpEarned: 500,
	},
	{
		type: AchievementType.STREAKER,
		name: 'Streaker',
		description: 'Win 5 games in a row',
		image: generateAchievmentCdnUrl('streaker.svg'),
		neededProgress: 5,
		xpEarned: 200,
	},
	{
		type: AchievementType.MASTER_STREAKER,
		name: 'Master Streaker',
		description: 'Win 10 games in a row',
		image: generateAchievmentCdnUrl('master_streaker.svg'),
		neededProgress: 10,
		xpEarned: 500,
	},
	{
		type: AchievementType.BOUNCER,
		name: 'Bouncer',
		description: 'Make a total of 200 bounce on your paddle',
		image: generateAchievmentCdnUrl('bouncer.svg'),
		neededProgress: 200,
		xpEarned: 100,
	},
	{
		type: AchievementType.PROFESIONAL_BOUNCER,
		name: 'Profesional Bouncer',
		description: 'Make a total of 500 bounce on your paddle',
		image: generateAchievmentCdnUrl('profesional_bouncer.svg'),
		neededProgress: 500,
		xpEarned: 200,
	},
	{
		type: AchievementType.CHAMPION,
		name: 'Champion',
		description: 'Have an ELO of 1250 or more',
		image: generateAchievmentCdnUrl('champion.svg'),
		neededProgress: 1250,
		xpEarned: 200,
		defaultProgress: 1000,
	},
	{
		type: AchievementType.MASTER,
		name: 'Master',
		description: 'Have an ELO of 1500 or more',
		image: generateAchievmentCdnUrl('master.svg'),
		neededProgress: 1500,
		xpEarned: 500,
		defaultProgress: 1000,
	},
	{
		type: AchievementType.LEGEND,
		name: 'Legend',
		description: 'Have an ELO of 1750 or more',
		image: generateAchievmentCdnUrl('legend.svg'),
		neededProgress: 1750,
		xpEarned: 1000,
		defaultProgress: 1000,
	},
	{
		type: AchievementType.PORTALS_USER,
		name: 'Portals User',
		description: 'Use portals 10 times',
		image: generateAchievmentCdnUrl('portals_user.svg'),
		neededProgress: 10,
		xpEarned: 100,
	},
	{
		type: AchievementType.PORTALS_ADDICT,
		name: 'Portals Addict',
		description: 'Use portals 50 times',
		image: generateAchievmentCdnUrl('portals_addict.svg'),
		neededProgress: 50,
		xpEarned: 300,
	},
	{
		type: AchievementType.ENDURANT,
		name: 'Endurant',
		description: 'Reach the prolongations',
		image: generateAchievmentCdnUrl('endurant.svg'),
		neededProgress: 1,
		xpEarned: 100,
	},
	{
		type: AchievementType.SEMI_MARATHON,
		name: 'Semi-Marathon',
		description: 'Make a unique game of 10 minutes or more',
		image: generateAchievmentCdnUrl('semi_marathon.svg'),
		neededProgress: 1,
		xpEarned: 500,
	},
	{
		type: AchievementType.MARATHON,
		name: 'Marathon',
		description: 'Make a unique game of 20 minutes or more',
		image: generateAchievmentCdnUrl('marathon.svg'),
		neededProgress: 1,
		xpEarned: 1000,
	},
];
