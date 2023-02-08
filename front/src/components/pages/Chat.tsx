import '@/style/Chat.css';
import { useState } from 'react';
import Button from '../global/Button';
import ChannelCreationForm from './details/chat/ChannelCreationForm';
import ChannelJoinList from './details/chat/ChannelJoinList';
import ChannelList from './details/chat/ChannelList';
import Messages from './details/chat/Messages';
import UserInput from './details/chat/UserInput';

enum ChatState {
	DEFAULT = 'DEFAULT',
	CREATING_CHANNEL = 'CREATING_CHANNEL',
	JOINING_CHANNEL = 'JOINING_CHANNEL',
}

export default function Chat() {
	const [selectedChannel, setSelectedChannel] = useState<number>(0);
	const [chatState, setChatState] = useState(ChatState.DEFAULT);

	function handleNewChannelClick() {
		setChatState(ChatState.CREATING_CHANNEL);
	}

	function handleJoinChannelClick() {
		setChatState(ChatState.JOINING_CHANNEL);
	}

	function isModalOpen() {
		return (
			chatState === ChatState.CREATING_CHANNEL ||
			chatState === ChatState.JOINING_CHANNEL
		);
	}

	return (
		<div className="chat-page">
			{isModalOpen() && (
				<div className={`chat-modal chat-modal-${chatState}`}>
					{chatState === ChatState.CREATING_CHANNEL && (
						<ChannelCreationForm
							closeModal={() => setChatState(ChatState.DEFAULT)}
						/>
					)}
					{chatState === ChatState.JOINING_CHANNEL && (
						<ChannelJoinList
							closeModal={() => setChatState(ChatState.DEFAULT)}
						/>
					)}
				</div>
			)}
			<div className="chat-page-left-side">
				<Button onClick={handleNewChannelClick}>
					Create new channel
				</Button>
				<Button onClick={handleJoinChannelClick}>Join channel</Button>
				<hr />
				<ChannelList
					setSelectedChannel={setSelectedChannel}
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
	);
}
