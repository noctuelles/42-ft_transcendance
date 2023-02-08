import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import Button from '@/components/global/Button';
import '@/style/details/chat/Channel.css';
import IChannel from './IChannel';
import { back_url } from '@/config.json';

interface IProps {
	channel: IChannel;
	isSelectedChannel: boolean;
	setSelectedChannel: any;
	hasJoined: boolean;
}

const Channel = ({
	channel,
	isSelectedChannel,
	setSelectedChannel,
	hasJoined,
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
			<span>{channel.name}</span>
		</li>
	);
};

export default Channel;
