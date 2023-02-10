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

	async function selectChannel() {
		setSelectedChannel(channel.id);
		channel.unreaded = 0;
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/' + channel.id + '/read', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});
	}

	return (
		<li
			className={'channel-list-item'}
			id={isSelectedChannel ? 'channel-list-item-selected' : undefined}
			onClick={selectChannel}
		>
			<span>
				{channel.unreaded > 0 && (
					<div className="channel-unread">{channel.unreaded}</div>
				)}
				{channel.name}
			</span>
		</li>
	);
};

export default Channel;
