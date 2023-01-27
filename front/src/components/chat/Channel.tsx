import IChannel from './IChannel';

export default function Channel({
	channel,
	setSelectedChannel,
	className,
	hasJoined,
}: {
	channel: IChannel;
	setSelectedChannel: any;
	className: string;
	hasJoined: boolean;
}) {
	return (
		<div
			className={'channel ' + className}
			onClick={() => {
				setSelectedChannel(channel.id);
			}}
		>
			<span>{channel.name}</span>
			{!hasJoined && (
				<button>
					Join
				</button>
			)}
		</div>
	);
}
