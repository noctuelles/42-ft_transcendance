import Grave from '@/assets/grave.svg';
import TableTennis from '@/assets/table-tennis.svg';
import Trophee from '@/assets/trophee.svg';
import Bounce from '@/assets/bounce.svg';
import '@/style/details/profile/ProfileSummaryItem.css';

interface ProfileSummaryItemProps {
	type: string;
	count: number;
}

function ProfileSummaryItem(props: ProfileSummaryItemProps) {
	const item = new Map([
		['won', { img: Trophee, text: 'Win' }],
		['played', { img: TableTennis, text: 'Played' }],
		['lost', { img: Grave, text: 'Lose' }],
		['bounce', { img: Bounce, text: 'Bounce' }],
	]);
	const selectedItem = item.get(props.type)!;

	return (
		<div className="profile-summary-item">
			<img src={selectedItem.img} width="60" height="60" />
			<div className="profile-summary-item-text">
				<p>{selectedItem.text}</p>
				<h3>{props.count || '-'}</h3>
			</div>
		</div>
	);
}

export default ProfileSummaryItem;
