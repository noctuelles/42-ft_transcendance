import '@/style/Chat.css';
import { useState } from 'react';
import Button from '../global/Button';
import ChannelCreationForm from './details/channel/ChannelCreationForm';
import ChannelList from './details/channel/ChannelList';
import Message from './details/channel/Message';

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
			<div className="chat-page-center">
				<ol className="chat-container">
					<Message
						from="plouvel"
						self={false}
						content="Bonjour à tous"
					/>
					<Message
						from="plouvel"
						self={false}
						content="Bonjour à tous"
					/>
					<Message
						from="jmaia"
						self={true}
						content="Bonjour à tous"
					/>
					<Message
						from="plouvel"
						self={false}
						content="Bonjour à tous"
					/>
					<Message
						from="jmaia"
						self={true}
						content="Bonjour à tous ceci est un emssage parfaitement long"
					/>
				</ol>
				<input
					className="textarea"
					type="text"
					placeholder="Type your message here..."
				/>
			</div>
			<div className="chat-page-right-side"></div>
		</div>
	) : (
		<ChannelCreationForm setter={setShowCreationForm} />
	);
}
