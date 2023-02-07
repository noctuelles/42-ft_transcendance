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
			{!hasJoined && (
				<Button
					onClick={() => {
						joinChannel(channel.id);
					}}
				>
					Join
				</Button>
			)}
		</li>
	);

	async function joinChannel(channelId: number): Promise<void> {
		const accessToken: string = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/join', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + accessToken,
			},
			body: JSON.stringify({
				channelId: channelId,
			}),
		});
	}
};

export default Channel;
