import {
	AchievementType,
	ProfileData,
	ProfileDataTarget,
} from './ProfileTypes';
import { AchievementMap } from './Data';
import AchievementItem from './AchievementItem';
import '@/style/details/profile/AchievementTable.css';
import { JsxElement } from 'typescript';

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
		let unlockedAchievement: any[] = [];
		let lockedAchievement: any[] = [];

		profile.achievements.forEach((a) => {
			const elem = <AchievementItem key={a.id} achievement={a} />;
			if (a.unlocked) {
				unlockedAchievement.push(elem);
			} else {
				lockedAchievement.push(elem);
			}
		});

		return [unlockedAchievement, lockedAchievement];
	}
};

export default AchievementTable;
