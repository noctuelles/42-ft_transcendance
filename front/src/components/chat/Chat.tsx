import { useState } from 'react';
import '@/style/chat/Chat.css';
import Messages from './Messages';
import UserInput from './UserInput';
import Channels from './Channels';

export default function Chat() {
	const [selectedChannel, setSelectedChannel] = useState<number>(1); // TODO: Remove mock
	return (
		<div className="chat">
			<Channels
				selectedChannel={selectedChannel}
				setSelectedChannel={setSelectedChannel}
			/>
			<Messages selectedChannel={selectedChannel} />
			<UserInput selectedChannel={selectedChannel} />
		</div>
	);
}
