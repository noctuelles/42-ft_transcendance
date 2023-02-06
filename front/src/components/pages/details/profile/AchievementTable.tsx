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

	function generateAchievementItem() {
		const unlockedAchievement = profile.achievements
			.filter((a) => a.unlocked)
			.map((a) => {
				return <AchievementItem key={a.id} achievement={a} />;
			});

		const lockedAchievement = profile.achievements
			.filter((a) => !a.unlocked)
			.map((a) => {
				return <AchievementItem key={a.id} achievement={a} />;
			});

		return [unlockedAchievement, lockedAchievement];
	}
};

export default AchievementTable;
