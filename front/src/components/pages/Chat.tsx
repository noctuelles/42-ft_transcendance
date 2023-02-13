import { ChatContext } from '@/context/ChatContext';
import '@/style/Chat.css';
import { useContext, useEffect, useRef, useState } from 'react';
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
	const [chatState, setChatState] = useState(ChatState.DEFAULT);
	const chatContext = useContext(ChatContext);
	const setuped = useRef(false);

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
		if (!chatContext.messages.has(channelId) && channelId !== 0) {
			await chatContext.fetchMessages(channelId);
		}
		chatContext.setSelectedChannel(channelId);
	}

	useEffect(() => {
		if (setuped.current) {
			window.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					setChatState(ChatState.DEFAULT);
				}
			});
			return () => {
				chatContext.setSelectedChannel(0);
				window.removeEventListener('keydown', () => {});
			};
		}
		setuped.current = true;
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
							selectedChannel={chatContext.selectedChannel}
							setSelectedChannel={selectChannel}
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
					selectedChannel={chatContext.selectedChannel}
				/>
			</div>
			<div className="chat-page-center">
				<Messages selectedChannel={chatContext.selectedChannel} />
				<UserInput selectedChannel={chatContext.selectedChannel} />
			</div>
			<div className="chat-page-right-side">
				<ChannelSideBar selectedChannel={chatContext.selectedChannel} />
			</div>
		</div>
	);
}
