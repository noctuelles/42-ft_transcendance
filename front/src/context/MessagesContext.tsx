import React from 'react';
import IMessage from '@/components/chat/IMessage';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL } from '@/config.json';
import { useRef } from 'react';

export const MessagesContext = React.createContext<{
	data: Map<number, IMessage[]>;
}>({} as { data: Map<number, IMessage[]> });

export default function MessagesContextProvider(props: any) {
	const messages = useRef(new Map<number, IMessage[]>());
	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data || !isChatMessage(data)) {
				return;
			}
			const newMessage = parseMessage(data);
			messages.current.set(newMessage.channel, [
				...(messages.current.get(newMessage.channel) || []),
				newMessage,
			]);
		},
		filter: ({ data }: { data: string }) => {
			return isChatMessage(data);
		},
	});
	return (
		<MessagesContext.Provider value={{ data: messages.current }}>
			{props.children}
		</MessagesContext.Provider>
	);

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
