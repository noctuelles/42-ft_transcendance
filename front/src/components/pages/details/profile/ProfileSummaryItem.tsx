import Trophee from '@/assets/trophee.svg'
import Cross from '@/assets/cross.svg'
import TableTennis from '@/assets/table-tennis.svg'

function ProfileSummaryItem(props: any) {
	const item = new Map([
		['won', {img: Trophee, text: "Win"}],
		['played', {img: TableTennis, text: "Played"}],
		['lost', {img: Cross, text: "Loose"}],
	]);
	const selectedItem = item.get(props.type);

	return (
		<div className="profile-summary-item">
			<img src={selectedItem?.img} width="60" height="60" />
			<p>{selectedItem?.text}</p>
			<h3>{props.count}</h3>
		</div>
	);
}

export default ProfileSummaryItem;
