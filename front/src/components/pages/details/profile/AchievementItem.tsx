import { ProfileAchievement } from './ProfileTypes';
import '@/style/details/profile/AchievementItem.css';
import ProgressBar from '@/components/global/ProgressBar';
import CheckMark from '@/assets/check-mark.svg';
import NoviceBall from '@/assets/novice-ball.svg';
import Cross from '@/assets/cross.svg';

interface AchievementItemProps {
	achievement: ProfileAchievement;
	unlocked: boolean;
	unlockedDate?: Date;
	progress?: string;
}

const AchievementItem = (props: AchievementItemProps) => {
	return (
		<div
			className="achievement-item-container"
			style={{ WebkitFilter: !props.unlocked ? 'blur(1px)' : '' }}
		>
			<h3>{props.achievement.title}</h3>
			<hr />
			<div className="achievement-item-top">
				<img src={NoviceBall} alt="Achievement" />
				<p>{props.achievement.description}</p>
			</div>

			<ProgressBar
				width="100%"
				height="15px"
				percent={12}
				innerBarColor="rgb(255, 153, 0)"
			/>
			<div className="achievement-item-bottom">
				<img
					src={props.unlocked ? CheckMark : Cross}
					alt="unlock state"
				/>
				<span>
					{props.unlocked ? (
						<>
							Unlocked on
							<br />
							<i>
								{props.unlockedDate?.toLocaleString('default', {
									day: '2-digit',
									month: '2-digit',
									year: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								})}
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
