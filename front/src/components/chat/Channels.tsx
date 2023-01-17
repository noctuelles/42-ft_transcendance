interface ISelectedChannel {
	selectedChannel: string;
	setSelectedChannel: (selectedChannel: string) => void;
}

export default function Channels({
	selectedChannel,
	setSelectedChannel,
}: ISelectedChannel) {
	return (
		<select
			id="channels"
			value={selectedChannel}
			onChange={(event) => setSelectedChannel(event.target.value)}
		>
			<option value="c-1">Channel 1</option>
			<option value="c-2">Channel 2</option>
			<option value="c-3">Channel 3</option>
			<option value="c-4">Channel 4</option>
		</select>
	);
}
