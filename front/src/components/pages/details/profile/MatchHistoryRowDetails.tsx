import ProgressBar from '@/components/global/ProgressBar';
import '@/style/details/profile/MatchHistoryRowDetails.css';

function SideDetails(side: string) {}

export function MatchHistoryRowDetails() {
	return (
		<div className="match-details">
			<div className="match-details-left">
				<ProgressBar percent={10} height="15px" text="lol" />
				<p>lol</p>
			</div>
			<div className="match-details-center"></div>
			<div className="match-details-right">
				<ProgressBar percent={10} />
			</div>
		</div>
	);
}
