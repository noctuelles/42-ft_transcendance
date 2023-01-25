import IChannel from './IChannel';

export default function Channel({
	channel,
	setSelectedChannel,
	className,
}: {
	channel: IChannel;
	setSelectedChannel: any;
	className: string;
}) {
	return (
		<div
			className={'channel ' + className}
			onClick={() => {
				setSelectedChannel(channel.id);
			}}
		>
			{channel.name}
		</div>
	);
}
