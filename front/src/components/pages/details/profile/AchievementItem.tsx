import '@/style/details/profile/AchievementItem.css';
import ProgressBar from '@/components/global/ProgressBar';
import CheckMark from '@/assets/check-mark.svg';
import Cross from '@/assets/cross.svg';
import NoviceBall from '@/assets/novice-ball.svg';
import { ProfileAchievementData } from './ProfileTypes';

interface AchievementItemProps {
	achievement: ProfileAchievementData;
}

const AchievementItem = ({ achievement }: AchievementItemProps) => {
	return (
		<div
			className="achievement-item-container"
			style={{
				WebkitFilter: !achievement.unlocked
					? 'blur(1px) grayscale(60%)'
					: '',
			}}
		>
			<h3>{achievement.name}</h3>
			<hr />
			<div className="achievement-item-top">
				<img src={achievement.image} alt="Achievement" />
				<p>{achievement.description}</p>
			</div>
			<ProgressBar
				width="100%"
				height="20px"
				percent={
					achievement.progress > achievement.objective
						? 100
						: Math.round(
								(achievement.progress / achievement.objective) *
									100,
						  )
				}
				text={`${achievement.progress}/${achievement.objective}`}
				innerBarColor="rgb(255, 153, 0)"
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
								{achievement.unlockedAt?.toLocaleString(
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
