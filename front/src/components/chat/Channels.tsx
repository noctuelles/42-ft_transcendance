interface ISelectedChannel {
	selectedChannel: number;
	setSelectedChannel: (selectedChannel: number) => void;
}

export default function Channels({
	selectedChannel,
	setSelectedChannel,
}: ISelectedChannel) {
	return (
		<select
			id="channels"
			value={selectedChannel}
			onChange={(event) =>
				setSelectedChannel(parseInt(event.target.value))
			}
		>
			<option value="1">Channel 1</option>
			<option value="2">Channel 2</option>
			<option value="3">Channel 3</option>
			<option value="4">Channel 4</option>
		</select>
	);
}
