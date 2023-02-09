import { useRef, useEffect } from 'react';
import { ChatContext } from '@/context/ChatContext';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import IMessage from './IMessage';
import Message from './Message';

export default function Messages({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	const messagesRef = useRef<HTMLOListElement>(null);
	const oldMaxScroll = useRef(0);

	const myUserName = useContext(UserContext).user.name;
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
		<ol ref={messagesRef} className="chat-container">
			{messages.map((x: IMessage, i: number) => (
				<Message
					key={selectedChannel + '-' + i}
					from={x.username}
					content={x.message}
					self={myUserName == x.username}
					isInvitation={x.isInvitation}
					invitationStatus={x.invitationStatus}
					selectedChannel={selectedChannel}
				/>
			))}
		</ol>
	);

	function getMessages(selectedChannel: number): IMessage[] {
		const messages = useContext(ChatContext)['messages'];
		const channelMessages = messages.get(selectedChannel);
		return channelMessages === undefined ? [] : channelMessages;
	}
}

export function scrollToBottom(element: HTMLElement) {
	element.scrollTop = getMaxScrollTop(element);
}

function getMaxScrollTop(element: HTMLElement) {
	return element.scrollHeight - element.clientHeight;
}
