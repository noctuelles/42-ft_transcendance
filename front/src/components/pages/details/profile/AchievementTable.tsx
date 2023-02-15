import {
	ProfileData,
} from './ProfileTypes';
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
					unlockedAchievement.length + lockedAchievement.length
				})`}
			</h2>
			<hr />
			<div className="achievements-item-container">
				{[...unlockedAchievement, ...lockedAchievement]}
			</div>
		</div>
	);

	function generateAchievementItem() {
		let unlockedAchievement: React.ReactNode[] = profile.achievements.filter((a) => a.unlocked)
			.map((a) => {a.unlockedAtDate = new Date(a.unlockedAt); return <AchievementItem key={a.id} achievement={a} />});
		let lockedAchievement: React.ReactNode[] = profile.achievements.filter((a) => !a.unlocked)
			.map((a) => <AchievementItem key={a.id} achievement={a} />);
		return [unlockedAchievement, lockedAchievement];
	}
};

export default AchievementTable;
