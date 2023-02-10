import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import IMessage from '@/components/pages/details/chat/IMessage';
import IChannel from '@/components/pages/details/chat/IChannel';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

interface IChatContext {
	messages: Map<number, IMessage[]>;
	channels: IChannel[];
	setChannels: React.Dispatch<React.SetStateAction<IChannel[]>>;
	fetchMessages: (channelId: number) => Promise<void>;
	selectedChannel: number;
	setSelectedChannel: React.Dispatch<React.SetStateAction<number>>;
}

export const ChatContext = React.createContext<IChatContext>(
	{} as IChatContext,
);

export default function ChatContextProvider(props: any) {
	const userContext = useContext(UserContext);
	const messages = useRef(new Map<number, IMessage[]>());
	const [channels, setChannels] = useState<IChannel[]>([]);
	const fetching = useRef(false);
	const navigate = useNavigate();
	const [selectedChannel, setSelectedChannel] = useState(0);

	async function setReaded(channelId: number) {
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/' + channelId + '/read', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});
	}

	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data || (!isChatMessage(data) && !isChannelsMessage(data))) {
				return;
			}
			if (isChatMessage(data)) {
				const newMessage = parseMessage(data);
				registerMessage(newMessage);
				setChannels((prev: IChannel[]) => {
					return prev.map((ch: IChannel) => {
						if (ch.id === newMessage.channel) {
							if (ch.id !== selectedChannel) {
								return {
									...ch,
									unreaded: ch.unreaded + 1,
								};
							} else {
								setReaded(ch.id);
							}
						}
						return ch;
					});
				});
			} else if (isChannelsMessage(data)) {
				setChannels(parseChannel(data));
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
				channels: channels,
				setChannels: setChannels,
				fetchMessages: fetchMessages,
				selectedChannel: selectedChannel,
				setSelectedChannel: setSelectedChannel,
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
