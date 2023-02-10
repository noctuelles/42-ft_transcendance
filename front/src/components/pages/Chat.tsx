import { ChatContext } from '@/context/ChatContext';
import '@/style/Chat.css';
import { useContext, useEffect, useState } from 'react';
import Button from '../global/Button';
import ChannelCreationForm from './details/chat/ChannelCreationForm';
import ChannelJoinList from './details/chat/ChannelJoinList';
import ChannelList from './details/chat/ChannelList';
import Messages from './details/chat/Messages';
import UserInput from './details/chat/UserInput';
import { back_url } from '@/config.json';
import { UserContext } from '@/context/UserContext';
import ChannelSideBar from './details/chat/ChannelSideBar';

enum ChatState {
	DEFAULT = 'DEFAULT',
	CREATING_CHANNEL = 'CREATING_CHANNEL',
	JOINING_CHANNEL = 'JOINING_CHANNEL',
}

export default function Chat() {
	const [selectedChannel, setSelectedChannel] = useState<number>(0);
	const [chatState, setChatState] = useState(ChatState.DEFAULT);
	const chatContext = useContext(ChatContext);

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

	async function selectChannel(channelId: number) {
		if (!chatContext.messages.has(channelId)) {
			await chatContext.fetchMessages(channelId);
		}
		setSelectedChannel(channelId);
	}

	useEffect(() => {
		window.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setChatState(ChatState.DEFAULT);
			}
		});
		return () => {
			window.removeEventListener('keydown', () => {});
		};
	}, []);

	return (
		<div className="chat-page">
			{isModalOpen() && (
				<div
					className={`chat-modal chat-modal-${chatState}`}
					onClick={() => setChatState(ChatState.DEFAULT)}
				>
					{chatState === ChatState.CREATING_CHANNEL && (
						<ChannelCreationForm
							closeModal={() => setChatState(ChatState.DEFAULT)}
						/>
					)}
					{chatState === ChatState.JOINING_CHANNEL && (
						<ChannelJoinList
							closeModal={() => setChatState(ChatState.DEFAULT)}
							selectedChannel={selectedChannel}
							setSelectedChannel={setSelectedChannel}
						/>
					)}
				</div>
			)}
			<div className="chat-page-left-side">
				<Button onClick={handleNewChannelClick}>
					Create new channel
				</Button>
				<Button onClick={handleJoinChannelClick}>
					Manage channels
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
				<ChannelSideBar selectedChannel={selectedChannel} />
			</div>
		</div>
	);
}
