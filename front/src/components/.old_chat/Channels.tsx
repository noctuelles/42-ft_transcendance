import ChannelList from './ChannelList';
import ChannelCreator from './ChannelCreator';

interface ISelectedChannel {
	selectedChannel: number;
	setSelectedChannel: (selectedChannel: number) => void;
}

export default function Channels({
	selectedChannel,
	setSelectedChannel,
}: ISelectedChannel) {
	return (
		<div id="channels">
			<ChannelList
				setSelectedChannel={setSelectedChannel}
				selectedChannel={selectedChannel}
			/>
			<ChannelCreator />
		</div>
	);
}
