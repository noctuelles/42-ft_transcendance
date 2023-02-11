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
				{channel.name}
			</span>
		</li>
	);
};

export default Channel;
