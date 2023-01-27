import { ProfileAchievementData, ProfileDataTarget } from './ProfileTypes';
import {
	AchievementId,
	AchievementIdArray,
	AchievementIdValue,
} from './ProfileTypes';
import { AchievementMap } from './Data';
import AchievementItem from './AchievementItem';
import '@/style/details/profile/AchievementTable.css';

interface AchievementTableProps {
	achievements: ProfileAchievementData[];
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

	//TODO: valeur pourcentage.
	function mapProfileValueToAchievement(target: ProfileDataTarget) {}

	function generateAchievementItem() {
		const unlockedAchievementId: number[] = props.achievements.map(
			(e) => e.id,
		);
		const lockedAchievementId: number[] = AchievementIdArray.filter(
			(id: number) => !unlockedAchievementId.includes(id),
		);

		const unlockedAchievement = props.achievements.map(
			(achievementData) => {
				return (
					<AchievementItem
						key={achievementData.id}
						unlocked={true}
						unlockedDate={new Date(achievementData.unlockedAt)}
						achievement={AchievementMap.get(achievementData.id)}
					/>
				);
			},
		);

		const lockedAchievement = lockedAchievementId.map((id) => (
			<AchievementItem
				key={id}
				unlocked={false}
				achievement={AchievementMap.get(id)}
			/>
		));

		return [unlockedAchievement, lockedAchievement];
	}
};

export default AchievementTable;
