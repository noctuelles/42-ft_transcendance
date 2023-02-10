import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import Button from '@/components/global/Button';
import '@/style/details/chat/Channel.css';
import IChannel from './IChannel';
import { back_url } from '@/config.json';
import { ChatContext } from '@/context/ChatContext';

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
	const chatContext = useContext(ChatContext);

	async function selectChannel() {
		setSelectedChannel(channel.id);
		setSelectedChannel(channel.id);
		chatContext.setChannels((prev: IChannel[]) => {
			return prev.map((ch: IChannel) => {
				if (ch.id === channel.id) {
					return {
						...ch,
						unreaded: 0,
					};
				}
				return ch;
			});
		});

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
