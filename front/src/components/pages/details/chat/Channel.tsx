import { UserContext } from '@/context/UserContext';
import '@/style/details/chat/Channel.css';
import { useContext } from 'react';
import IChannel, { ChannelType } from './IChannel';

interface IProps {
	channel: IChannel;
	isSelectedChannel: boolean;
	setSelectedChannel: any;
}

const Channel = ({
	channel,
	isSelectedChannel,
	setSelectedChannel,
}: IProps) => {
	const userContext = useContext(UserContext);
	return (
		<li
			className={'channel-list-item'}
			id={isSelectedChannel ? 'channel-list-item-selected' : undefined}
			onClick={() => {
				setSelectedChannel(channel.id);
			}}
		>
			<span>
				{channel.unreaded > 0 && (
					<div className="channel-unread">{channel.unreaded}</div>
				)}
				{channel.type === ChannelType.PRIVATE_MESSAGE
					? channel.name
							.split(' - ')
							.find((name) => name !== userContext.user.name) +
					  ' (PM)'
					: channel.name}
			</span>
		</li>
	);
};

export default Channel;
