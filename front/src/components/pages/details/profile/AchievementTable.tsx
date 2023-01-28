import { ProfileData, ProfileDataTarget } from './ProfileTypes';
import { AchievementIdArray } from './ProfileTypes';
import { AchievementMap } from './Data';
import AchievementItem from './AchievementItem';
import '@/style/details/profile/AchievementTable.css';

interface AchievementTableProps {
	profile: ProfileData;
}

const AchievementTable = (props: AchievementTableProps) => {
	const [unlockedAchievement, lockedAchievement] = generateAchievementItem();

	return (
		<div className="achievements-table">
			<h2>
				{`Achievements (${unlockedAchievement.length}/${AchievementIdArray.length})`}
			</h2>
			<hr />
			<div className="achievements-item-container">
				{[...unlockedAchievement, ...lockedAchievement]}
			</div>
		</div>
	);

	//TODO: valeur pourcentage. and remove this if forest.
	function mapProfileValueToAchievement(target: ProfileDataTarget): number {
		if (target === ProfileDataTarget.PROFILE_MATCH)
			return props.profile.matchesCount;
		else if (target == ProfileDataTarget.PROFILE_MATCH_WON)
			return props.profile.matchesWonCount;
		return 0;
	}

	function generateAchievementItem() {
		const unlockedAchievementId: number[] = props.profile.achievements.map(
			(e) => e.id,
		);
		const lockedAchievementId: number[] = AchievementIdArray.filter(
			(id: number) => !unlockedAchievementId.includes(id),
		);

		//TODO: a bit of code duplication here. Can be done smarter
		const unlockedAchievement = props.profile.achievements.map(
			(achievementData) => {
				// We're asserting that the database will always return valid ids
				// (hence the exclamation mark at the end of the next statement;
				const profileAchievement = AchievementMap.get(
					achievementData.id,
				)!;
				return (
					<AchievementItem
						key={achievementData.id}
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

		const lockedAchievement = lockedAchievementId.map((id) => {
			const profileAchievement = AchievementMap.get(id)!;

			return (
				<AchievementItem
					key={id}
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
