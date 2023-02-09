import React from 'react';
import IMessage from '@/components/pages/details/chat/IMessage';
import IChannel from '@/components/pages/details/chat/IChannel';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL } from '@/config.json';
import { useRef } from 'react';

export const ChatContext = React.createContext<{
	messages: Map<number, IMessage[]>;
	channels: IChannel[];
}>(
	{} as {
		messages: Map<number, IMessage[]>;
		channels: IChannel[];
	},
);

export default function ChatContextProvider(props: any) {
	const messages = useRef(new Map<number, IMessage[]>());
	const channels = useRef<IChannel[]>([]);
	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data || (!isChatMessage(data) && !isChannelsMessage(data))) {
				return;
			}
			if (isChatMessage(data)) {
				const newMessage = parseMessage(data);
				messages.current.set(newMessage.channel, [
					...(messages.current.get(newMessage.channel) || []),
					newMessage,
				]);
			} else if (isChannelsMessage(data)) {
				channels.current = parseChannel(data);
			}
		},
		filter: ({ data }: { data: string }) => {
			return isChatMessage(data) || isChannelsMessage(data);
		},
	});
	return (
		<ChatContext.Provider
			value={{
				messages: messages.current,
				channels: channels.current,
			}}
		>
			{props.children}
		</ChatContext.Provider>
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

	function isChannelsMessage(rawMessage: string) {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'channels';
	}

	function parseChannel(rawMessage: string): IChannel[] {
		const jsonMessage = JSON.parse(rawMessage);
		return jsonMessage['data'];
	}
}
