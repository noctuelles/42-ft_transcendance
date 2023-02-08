import Button from '@/components/global/Button';
import '@/style/details/chat/ChannelJoinList.css';
import { useState } from 'react';
import ChannelJoinDisplay from './ChannelJoinDisplay';
import ChannelJoinSelector from './ChannelJoinSelector';

export enum ChannelJoinType {
	PUBLIC = 'PUBLIC',
	PASSWORD_PROTECTED = 'PASSWORD PROTECTED',
	INVITED = 'INVITED',
}

function ChannelJoinList({ closeModal }: { closeModal: () => void }) {
	const [joinType, setJoinType] = useState(ChannelJoinType.PUBLIC);

	return (
		<div className="channel-join-list">
			<Button
				onClick={closeModal}
				width="80px"
				height="40px"
				fontSize="20px"
			>
				Close
			</Button>
			<ChannelJoinSelector
				joinType={joinType}
				setJoinType={setJoinType}
			/>
			<ChannelJoinDisplay joinType={joinType} />
		</div>
	);
}

export default ChannelJoinList;
