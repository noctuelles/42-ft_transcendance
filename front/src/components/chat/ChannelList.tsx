import { useRef, useEffect } from 'react';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import IChannel from './IChannel';
import Channel from './Channel';

export default function ChannelList({
	setSelectedChannel,
	selectedChannel,
}: {
	setSelectedChannel: any;
	selectedChannel: number;
}) {
	const channels = getChannels();
	return (
		<>
			{channels.map((channel) => {
				var classSelected: string = '';
				if (selectedChannel == channel.id)
					classSelected = 'selectedChannel';
				return (
					<Channel
						key={channel.id}
						channel={channel}
						className={classSelected}
						setSelectedChannel={setSelectedChannel}
					/>
				);
			})}
		</>
	);
}

function getChannels(): IChannel[] {
	const channels = useRef<IChannel[]>([]);
	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data || !isChannelsMessage(data)) {
				return;
			}
			channels.current = parseChannel(data);
		},
		filter: ({ data }: { data: string }) => {
			return isChannelsMessage(data);
		},
	});
	useEffect(() => {
		const jsonMessage = { event: 'channels', data: {} };
		sendMessage(JSON.stringify(jsonMessage));
	}, []);
	return channels.current;
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
