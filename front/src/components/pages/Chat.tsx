import '@/style/Chat.css';
import { useState } from 'react';
import Button from '../global/Button';
import ChannelCreationForm from './details/channel/ChannelCreationForm';
import ChannelList from './details/channel/ChannelList';

export default function Chat() {
	const [showCreationForm, setShowCreationForm] = useState(false);

	function handleNewChannelClick() {
		setShowCreationForm(true);
	}

	return !showCreationForm ? (
		<div className="chat-page">
			<div className="chat-page-left-side">
				<Button onClick={handleNewChannelClick}>
					Create new channel
				</Button>
				<hr />
				<ChannelList />
			</div>
			<div className="chat-page-center"></div>
			<div className="chat-page-right-side"></div>
		</div>
	) : (
		<ChannelCreationForm />
	);
}
