import { MessagesContext } from '@/context/MessagesContext';
import '@/style/Chat.css';
import { useContext, useState } from 'react';
import Button from '../global/Button';
import ChannelCreationForm from './details/chat/ChannelCreationForm';
import ChannelList from './details/chat/ChannelList';
import Messages from './details/chat/Messages';
import UserInput from './details/chat/UserInput';

export default function Chat() {
	const [showCreationForm, setShowCreationForm] = useState(false);
	const [selectedChannel, setSelectedChannel] = useState<number>(0);
	const messagesContext = useContext(MessagesContext);

	function handleNewChannelClick() {
		setShowCreationForm(true);
	}

	async function selectChannel(channelId: number) {
		if (!messagesContext.data.has(channelId)) {
			await messagesContext.fetchMessages(channelId);
		}
		setSelectedChannel(channelId);
	}

	return !showCreationForm ? (
		<div className="chat-page">
			<div className="chat-page-left-side">
				<Button onClick={handleNewChannelClick}>
					Create new channel
				</Button>
				<hr />
				<ChannelList
					setSelectedChannel={selectChannel}
					selectedChannel={selectedChannel}
				/>
			</div>
			<div className="chat-page-center">
				<Messages selectedChannel={selectedChannel} />
				<UserInput selectedChannel={selectedChannel} />
			</div>
			<div className="chat-page-right-side">
				<h3>Channel name</h3>
			</div>
		</div>
	) : (
		<ChannelCreationForm setter={setShowCreationForm} />
	);
}
