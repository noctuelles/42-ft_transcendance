import {
	ProfileAchievement,
	ProfileDataTarget,
	AchievementId,
} from './ProfileTypes';
import NoviceBall from '@/assets/novice-ball.svg';
import JackOLanternBall from '@/assets/jack-o-lantern-ball.svg';
import DiscoBall from '@/assets/disco-ball.svg';
import RegularBall from '@/assets/regular-ball.svg';

export const bounceImg: string =
	'data:image/svg+xml;utf8;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJVcGxvYWRlZCB0byBzdmdyZXBvLmNvbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiMwMDAwMDAiIHRyYW5zZm9ybT0icm90YXRlKDkwKSI+Cg08ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIvPgoNPGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cg08ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+IC5iZW50YmxvY2tzX2VlbntmaWxsOiMwQjE3MTk7fSA8L3N0eWxlPiA8cGF0aCBjbGFzcz0iYmVudGJsb2Nrc19lZW4iIGQ9Ik0yOCwyN3YySDR2LTJIMjh6IE0xMSwxMGMwLTIuNzYxLDIuMjM5LTUsNS01czUsMi4yMzksNSw1cy0yLjIzOSw1LTUsNVMxMSwxMi43NjEsMTEsMTB6IE0xMywxMCBjMCwxLjY1NCwxLjM0NiwzLDMsM2MxLjY1NCwwLDMtMS4zNDYsMy0zYzAtMS42NTQtMS4zNDYtMy0zLTNDMTQuMzQ2LDcsMTMsOC4zNDYsMTMsMTB6IE0yMSwxOWwtNSw4bC01LThoNHYtM2gydjNIMjF6IE0xNiwyMy4yMjYgTDE3LjM5MSwyMWgtMi43ODNMMTYsMjMuMjI2eiIvPiA8L2c+Cg08L3N2Zz4=';

export const tropheeImg: string =
	'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IlVwbG9hZGVkIHRvIHN2Z3JlcG8uY29tIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc2hhcnBjb3JuZXJzX2VlbntmaWxsOiMxMTE5MTg7fQ0KCS5zdDB7ZmlsbDojMTExOTE4O30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic2hhcnBjb3JuZXJzX2VlbiIgZD0iTTIwLDIzaC04djVoLTF2MmgxMHYtMmgtMVYyM3ogTTE0LDI1aDR2MWgtNFYyNXogTTE0LDI4di0xaDR2MUgxNHogTTI0LDJIOEM1LjI0MywyLDMsNC4yNDMsMyw3DQoJczIuMjQzLDUsNSw1YzAsNC4wNzksMy4wNTUsNy40MzgsNyw3LjkzMVYyMmgydi0yLjA2OWMzLjk0NS0wLjQ5Myw3LTMuODUyLDctNy45MzFjMi43NTcsMCw1LTIuMjQzLDUtNVMyNi43NTcsMiwyNCwyeiBNNSw3DQoJYzAtMS42NTQsMS4zNDYtMywzLTN2NkM2LjM0NiwxMCw1LDguNjU0LDUsN3ogTTI0LDEwVjRjMS42NTQsMCwzLDEuMzQ2LDMsM1MyNS42NTQsMTAsMjQsMTB6Ii8+DQo8L3N2Zz4=';

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
			threeshold: 1,
		},
	],
]);
