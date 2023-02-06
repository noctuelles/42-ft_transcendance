import { ProfileAchievement } from './ProfileTypes';
import '@/style/details/profile/AchievementItem.css';
import ProgressBar from '@/components/global/ProgressBar';
import CheckMark from '@/assets/check-mark.svg';
import Cross from '@/assets/cross.svg';
import NoviceBall from '@/assets/novice-ball.svg';

interface AchievementItemProps {
	achievement: ProfileAchievement;
	unlocked: boolean;
	unlockedDate?: Date;
	progress: number;
	threeshold: number;
}

const AchievementItem = (props: AchievementItemProps) => {
	return (
		<div
			className="achievement-item-container"
			style={{
				WebkitFilter: !props.unlocked ? 'blur(1px) grayscale(60%)' : '',
			}}
		>
			<h3>{props.achievement.title}</h3>
			<hr />
			<div className="achievement-item-top">
				<img src={props.achievement.img.toString()} alt="Achievement" />
				<p>{props.achievement.description}</p>
			</div>
			<ProgressBar
				height="1.3em"
				percent={Math.round((props.progress / props.threeshold) * 100)}
				text={
					props.progress > props.threeshold
						? `${props.threeshold}/${props.threeshold}`
						: `${props.progress}/${props.threeshold}`
				}
				innerBarColor="rgb(255, 153, 0)"
			/>
			<div className="achievement-item-bottom">
				<img
					src={props.unlocked ? CheckMark : Cross}
					alt="unlock_state"
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
