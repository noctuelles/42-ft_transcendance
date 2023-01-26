import { ProfileAchievement } from './ProfileTypes';

interface AchievementItemProps {
	achievement: ProfileAchievement;
}

const AchievementItem = (props: AchievementItemProps) => {
	return (
		<div className="achievement-item-container">
			{props.achievement.description}
		</div>
	);
};

export default AchievementItem;
