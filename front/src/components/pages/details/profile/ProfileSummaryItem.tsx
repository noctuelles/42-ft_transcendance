import Trophee from '@/assets/trophee.svg';
import Cross from '@/assets/cross.svg';
import TableTennis from '@/assets/table-tennis.svg';
import '@/style/details/profile/ProfileSummaryItem.css';

function ProfileSummaryItem(props: any) {
	const item = new Map([
		['won', { img: Trophee, text: 'Win' }],
		['played', { img: TableTennis, text: 'Played' }],
		['lost', { img: Cross, text: 'Loose' }],
	]);
	const selectedItem = item.get(props.type);

	return (
		<div className="profile-summary-item">
			<img src={selectedItem?.img} width="60" height="60" />
			<div className="profile-summary-item-text">
				<p>{selectedItem?.text}</p>
				<h3>{props.count || '-'}</h3>
			</div>
		</div>
	);
}

export default ProfileSummaryItem;
