import { useRef } from 'react';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import IChannel from './IChannel';
import Channel from './Channel';
import { ChannelType } from './IChannel';

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
	const channels = useRef<IChannel[]>([
		{
			id: 1,
			name: 'Channel one',
			type: ChannelType.PUBLIC,
			owner_id: 4,
			members: [],
		},
		{
			id: 2,
			name: 'Channel two',
			type: ChannelType.PUBLIC,
			owner_id: 4,
			members: [],
		},
		{
			id: 3,
			name: 'Channel three',
			type: ChannelType.PUBLIC,
			owner_id: 4,
			members: [],
		},
		{
			id: 4,
			name: 'Channel four',
			type: ChannelType.PUBLIC,
			owner_id: 4,
			members: [],
		},
	]); // TODO: Remove theses mock channels and get them from the back
	useWebSocket(WS_URL, {
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
