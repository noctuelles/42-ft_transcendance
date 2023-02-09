import React, { useContext } from 'react';
import IMessage from '@/components/chat/IMessage';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';
import { useRef } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';

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
	const fetching = useRef(false);
	const navigate = useNavigate();

	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data) {
				return;
			}
			if (isChatMessage(data)) {
				const newMessage = parseMessage(data);
				registerMessage(newMessage);
			}
			if (isChatDeleteMessage(data)) {
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
			}
			if (isChatEditMessage(data)) {
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
			}
			if (isChatGameMessage(data)) {
				navigate('/play?invite');
			}
		},
		filter: ({ data }: { data: string }) => {
			return (
				isChatMessage(data) ||
				isChatDeleteMessage(data) ||
				isChatEditMessage(data) ||
				isChatGameMessage(data)
			);
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

	function parseMessage(rawMessage: string): IMessage {
		const jsonMessage = JSON.parse(rawMessage);
		return jsonMessage['data'];
	}
}
