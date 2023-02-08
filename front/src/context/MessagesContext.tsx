import React, { useContext } from 'react';
import IMessage from '@/components/chat/IMessage';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';
import { useRef } from 'react';
import { UserContext } from './UserContext';

export const MessagesContext = React.createContext<{
	data: Map<number, IMessage[]>;
	fetchMessages: (channelId: number) => Promise<void>;
}>(
	{} as {
		data: Map<number, IMessage[]>;
		fetchMessages: (channelId: number) => Promise<void>;
	},
);

export default function MessagesContextProvider(props: any) {
	const userContext = useContext(UserContext);
	const messages = useRef(new Map<number, IMessage[]>());
	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data || !isChatMessage(data)) {
				return;
			}
			const newMessage = parseMessage(data);
			registerMessage(newMessage);
		},
		filter: ({ data }: { data: string }) => {
			return isChatMessage(data);
		},
	});
	return (
		<MessagesContext.Provider
			value={{ data: messages.current, fetchMessages }}
		>
			{props.children}
		</MessagesContext.Provider>
	);

	async function registerMessage(newMessage: IMessage) {
		if (!messages.current.has(newMessage.channel)) {
			await fetchMessages(newMessage.channel);
		}
		messages.current.set(newMessage.channel, [
			...(messages.current.get(newMessage.channel) || []),
			newMessage,
		]);
	}

	async function fetchMessages(channelId: number) {
		const token = await userContext.getAccessToken();
		return new Promise<void>((resolve) => {
			fetch(back_url + '/chat/channel/' + channelId + '/messages', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					messages.current.set(channelId, data);
					resolve();
				});
		});
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
