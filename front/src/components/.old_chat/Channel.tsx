import IChannel from './IChannel';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { back_url } from '@/config.json';

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
	const userContext = useContext(UserContext);
	return (
		<div
			className={'channel ' + className}
			onClick={() => {
				setSelectedChannel(channel.id);
			}}
		>
			<span>{channel.name}</span>
			{!hasJoined && (
				<button
					onClick={() => {
						joinChannel(channel.id);
					}}
				>
					Join
				</button>
			)}
		</div>
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
}
