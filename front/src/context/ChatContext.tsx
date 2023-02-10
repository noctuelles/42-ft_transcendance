import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import IMessage from '@/components/pages/details/chat/IMessage';
import IChannel from '@/components/pages/details/chat/IChannel';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

export const ChatContext = React.createContext<{
	messages: Map<number, IMessage[]>;
	channels: IChannel[];
	fetchMessages: (channelId: number) => Promise<void>;
}>(
	{} as {
		messages: Map<number, IMessage[]>;
		channels: IChannel[];
		fetchMessages: (channelId: number) => Promise<void>;
	},
);

export default function ChatContextProvider(props: any) {
	const userContext = useContext(UserContext);
	const messages = useRef(new Map<number, IMessage[]>());
	const channels = useRef<IChannel[]>([]);
	const fetching = useRef(false);
	const navigate = useNavigate();
	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data || (!isChatMessage(data) && !isChannelsMessage(data))) {
				return;
			}
			if (isChatMessage(data)) {
				const newMessage = parseMessage(data);
				registerMessage(newMessage);
			} else if (isChannelsMessage(data)) {
				channels.current = parseChannel(data);
			} else if (isChatDeleteMessage(data)) {
				const obj = JSON.parse(data).data;
				if (obj.type == 'invitation') {
					const channelId = obj.channel;
					const username = obj.createdBy;
					if (messages.current.has(channelId)) {
						messages.current.set(
							channelId,
							messages.current
								.get(channelId)!
								.filter(
									(m) =>
										m.username !== username ||
										!m.isInvitation,
								),
						);
					}
				}
			} else if (isChatEditMessage(data)) {
				const obj = JSON.parse(data).data;
				if (obj.type == 'invitation') {
					const channelId = obj.channel;
					const username = obj.createdBy;
					if (messages.current.has(channelId)) {
						messages.current.set(
							channelId,
							messages.current.get(channelId)!.map((m) => {
								if (m.username === username && m.isInvitation) {
									return {
										...m,
										invitationStatus: obj.result,
									};
								}
								return m;
							}),
						);
					}
				}
			} else if (isChatGameMessage(data)) {
				navigate('/play?invite');
			}
		},
		filter: ({ data }: { data: string }) => {
			return (
				isChatMessage(data) ||
				isChannelsMessage(data) ||
				isChatDeleteMessage(data) ||
				isChatEditMessage(data) ||
				isChatGameMessage(data)
			);
		},
	});
	return (
		<ChatContext.Provider
			value={{
				messages: messages.current,
				channels: channels.current,
				fetchMessages: fetchMessages,
			}}
		>
			{props.children}
		</ChatContext.Provider>
	);

	async function registerMessage(newMessage: IMessage) {
		while (fetching.current) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		if (!messages.current.has(newMessage.channel)) {
			fetching.current = true;
			await fetchMessages(newMessage.channel);
			fetching.current = false;
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

	function isChannelsMessage(rawMessage: string) {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'channels';
	}

	function isChatDeleteMessage(rawMessage: string): boolean {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'chat-delete';
	}
	function isChatEditMessage(rawMessage: string): boolean {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'chat-edit';
	}

	function isChatGameMessage(rawMessage: string): boolean {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'chat-game';
	}

	function parseChannel(rawMessage: string): IChannel[] {
		const jsonMessage = JSON.parse(rawMessage);
		return jsonMessage['data'];
	}
}
