import { useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL } from '@/config.json';
import IMessage from './IMessage';

// TODO: Add another interface. One without channel and one with. Maybe inheritence. Maybe commposition. Good luck !
export default function Messages({
	selectedChannel,
}: {
	selectedChannel: string;
}) {
	const messages: IMessage[] = getMessages();
	return (
		<div id="messages">
			{messages.map((x: IMessage, i: number) => (
				<Message
					key={i}
					user={x.user}
					message={x.message}
					channel={x.channel}
				/> // TODO: Change key
			))}
		</div>
	);

	function getMessages(): IMessage[] {
		// TODO: Get messages from context and change messages according to selectedChannel
		const messages = useRef<Record<string, IMessage[]>>({
			'1': [],
			'2': [{ user: 'Alice', channel: 'c-2', message: 'Salut !' }],
			'3': [{ user: 'Bob', channel: 'c-3', message: 'Superbe !' }],
			'4': [{ user: 'Carol', channel: 'c-4', message: 'Fuck !' }],
		});
		useWebSocket(WS_URL, {
			share: true,
			onMessage: ({ data }: { data?: string }) => {
				if (!data || !isChatMessage(data)) {
					return;
				}
				const newMessage = parseMessage(data);
				messages.current['1'] = [...messages.current['1'], newMessage];
			},
			filter: ({ data }: { data: string }) => {
				return isChatMessage(data);
			},
		});
		return messages.current[selectedChannel];
	}

	function isChatMessage(rawMessage: string): boolean {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'chat';
	}

	function parseMessage(rawMessage: string): IMessage {
		const jsonMessage = JSON.parse(rawMessage);
		return jsonMessage['data'];
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
