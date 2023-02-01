import {
	AchievementType,
	ProfileData,
	ProfileDataTarget,
} from './ProfileTypes';
import { AchievementMap } from './Data';
import AchievementItem from './AchievementItem';
import '@/style/details/profile/AchievementTable.css';

interface AchievementTableProps {
	profile: ProfileData;
}

const AchievementTable = ({ profile }: AchievementTableProps) => {
	const [unlockedAchievement, lockedAchievement] = generateAchievementItem();

	return (
		<div className="achievements-table">
			<h2>
				{`Achievements (${unlockedAchievement.length}/${
					Object.values(AchievementType).length
				})`}
			</h2>
			<hr />
			<div className="achievements-item-container">
				{[...unlockedAchievement, ...lockedAchievement]}
			</div>
		</div>
	);

	//TODO: remove this if forest.
	function mapProfileValueToAchievement(target: ProfileDataTarget): number {
		if (target === ProfileDataTarget.PROFILE_MATCH)
			return profile.wonMatches + profile.lostMatches;
		else if (target == ProfileDataTarget.PROFILE_MATCH_WON)
			return profile.wonMatches;
		return 0;
	}

	function generateAchievementItem() {
		const unlockedAchievementType: string[] = profile.achievements.map(
			(achievement) => achievement.type,
		);

		const lockedAchievementType: string[] = Object.values(
			AchievementType,
		).filter((s) => !unlockedAchievementType.includes(s));

		const unlockedAchievement = profile.achievements.map(
			(achievementData) => {
				const profileAchievement = AchievementMap.get(
					achievementData.type,
				)!;
				return (
					<AchievementItem
						key={profileAchievement.title}
						unlocked={true}
						unlockedDate={new Date(achievementData.unlockedAt)}
						progress={mapProfileValueToAchievement(
							profileAchievement.data,
						)}
						threeshold={profileAchievement.threeshold}
						achievement={profileAchievement}
					/>
				);
			},
		);

		const lockedAchievement = lockedAchievementType.map((type) => {
			const profileAchievement = AchievementMap.get(type.toString())!;

			return (
				<AchievementItem
					key={profileAchievement.title}
					unlocked={false}
					progress={mapProfileValueToAchievement(
						profileAchievement.data,
					)}
					threeshold={profileAchievement.threeshold}
					achievement={profileAchievement}
				/>
			);
		});

		return [unlockedAchievement, lockedAchievement];
	}
};

export default AchievementTable;
