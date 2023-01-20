import { useContext } from 'react';
import IMessage from './IMessage';
import { MessagesContext } from '@/context/MessagesContext';

// TODO: Add another interface. One without channel and one with. Maybe inheritence. Maybe commposition. Good luck !
export default function Messages({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	const messages: IMessage[] = getMessages(selectedChannel);
	return (
		<div id="messages">
			{messages.map((x: IMessage, i: number) => (
				<Message
					key={selectedChannel + '-' + i}
					user={x.user}
					message={x.message}
					channel={x.channel}
				/>
			))}
		</div>
	);

	function getMessages(selectedChannel: number): IMessage[] {
		const messages = useContext(MessagesContext)['data'];
		const channelMessages = messages.get(selectedChannel);
		return channelMessages === undefined ? [] : channelMessages;
	}
}

function Message(props: IMessage) {
	return (
		<span className="message">
			<span className="user">{props.user}: </span>
			<span className="content">{props.message}</span>
			<br />
		</span>
	);
}
