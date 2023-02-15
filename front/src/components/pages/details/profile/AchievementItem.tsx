import '@/style/details/profile/AchievementItem.css';
import ProgressBar from '@/components/global/ProgressBar';
import CheckMark from '@/assets/check-mark.svg';
import Cross from '@/assets/cross.svg';
import { ProfileAchievementData } from './ProfileTypes';

interface AchievementItemProps {
	achievement: ProfileAchievementData;
}

const AchievementItem = ({ achievement }: AchievementItemProps) => {
	return (
		<div
			className="achievement-item-container"
			style={{
				border: achievement.unlocked
					? 'solid 1.5px #17c0e9'
					: 'solid 1.5px black',
				boxShadow: achievement.unlocked
					? '0 0 10px #17bfe9b8'
					: '0px 0px 3px 1px rgba(0, 0, 0, 0.71)',
			}}
		>
			<h3>{achievement.name}</h3>
			<hr />
			<div className="achievement-item-top">
				<img src={achievement.image} alt="Achievement" />
				<p>{achievement.description}</p>
			</div>
			<ProgressBar
				height="1.3em"
				percent={Math.round(
					(achievement.progress / achievement.objective) * 100,
				)}
				text={
					achievement.progress > achievement.objective
						? `${achievement.objective}/${achievement.objective}`
						: `${achievement.progress}/${achievement.objective}`
				}
				innerBarColor={
					achievement.unlocked ? '#17c0e9' : 'rgb(255, 153, 0)'
				}
			/>
			<div className="achievement-item-bottom">
				<img
					src={achievement.unlocked ? CheckMark : Cross}
					alt="unlock_state"
				/>
				<span>
					{achievement.unlocked ? (
						<>
							Unlocked on
							<br />
							<i>
								{achievement.unlockedAtDate?.toLocaleString(
									'default',
									{
										day: '2-digit',
										month: '2-digit',
										year: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
									},
								)}
							</i>
						</>
					) : (
						'Locked'
					)}
				</span>
			</div>
		</div>
	);
};

export default AchievementItem;
