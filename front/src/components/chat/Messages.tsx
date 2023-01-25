import { useContext } from 'react';
import IMessage from './IMessage';
import { MessagesContext } from '@/context/MessagesContext';
import { useRef, useEffect } from 'react';

// TODO: Add another interface. One without channel and one with. Maybe inheritence. Maybe commposition. Good luck !
export default function Messages({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	const messagesRef = useRef<HTMLDivElement>(null);
	const oldMaxScroll = useRef(0);

	const messages: IMessage[] = getMessages(selectedChannel);
	useEffect(() => {
		if (messagesRef.current) {
			if (oldMaxScroll.current == messagesRef.current.scrollTop) {
				scrollToBottom(messagesRef.current);
			}
			oldMaxScroll.current = getMaxScrollTop(messagesRef.current);
		}
	});
	return (
		<div id="messages" ref={messagesRef}>
			{messages.map((x: IMessage, i: number) => (
				<Message
					key={selectedChannel + '-' + i}
					username={x.username}
					message={x.message}
					channel={x.channel}
				/>
			))}
		</div>
	);

	function scrollToBottom(element: HTMLElement) {
		element.scrollTop = getMaxScrollTop(element);
	}

	function getMaxScrollTop(element: HTMLElement) {
		return element.scrollHeight - element.clientHeight;
	}

	function getMessages(selectedChannel: number): IMessage[] {
		const messages = useContext(MessagesContext)['data'];
		const channelMessages = messages.get(selectedChannel);
		return channelMessages === undefined ? [] : channelMessages;
	}
}

function Message(props: IMessage) {
	return (
		<span className="message">
			<span className="username">{props.username}: </span>
			<span className="content">{props.message}</span>
			<br />
		</span>
	);
}
