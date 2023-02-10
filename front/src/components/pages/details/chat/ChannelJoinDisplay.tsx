import { useContext, useEffect, useRef, useState } from 'react';
import { ChannelJoinType } from './ChannelJoinList';
import { back_url } from '@/config.json';
import { UserContext } from '@/context/UserContext';
import Loader from '@/components/global/Loader';
import usersGroupIcon from '@/assets/users-group.svg';
import Button from '@/components/global/Button';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { ChatContext } from '@/context/ChatContext';

interface IJoinnableChannel {
	id: number;
	name: string;
	members: number;
	joined: boolean;
}

interface IChannelJoinListProps {
	joinType: ChannelJoinType;
	selectedChannel: number;
	setSelectedChannel: (channelId: number) => void;
}

function ChannelJoinDisplay(props: IChannelJoinListProps) {
	const [channels, setChannels] = useState<IJoinnableChannel[]>([]);
	const [choose, setChoose] = useState(-1);
	const [password, setPassword] = useState('');
	const [fetched, setFetched] = useState(false);
	const fetching = useRef(false);
	const userContext = useContext(UserContext);
	const infoBoxContext = useContext(InfoBoxContext);
	const chatContext = useContext(ChatContext);

	useEffect(() => {
		async function fetchData() {
			const token = await userContext.getAccessToken();
			fetch(
				back_url +
					'/chat/channels/' +
					props.joinType.toLowerCase().replace(' ', '-'),
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
				.then((res) => res.json())
				.then((data) => {
					setChannels(data);
					fetching.current = false;
					setFetched(true);
				});
		}
		if (!fetching.current) {
			fetching.current = true;
			setFetched(false);
			fetchData();
		}
	}, [props.joinType]);

	async function joinWithoutPassword(channelId: number) {
		if (props.joinType == ChannelJoinType.PASSWORD_PROTECTED) {
			setChoose(channelId);
			return;
		}
		joinChannel({ channelId: channelId }, channelId);
	}

	async function joinWithPassword() {
		if (password.length < 1) return;
		if (choose == -1) return;
		await joinChannel({ channelId: choose, password: password }, choose);
		setChoose(-1);
		setPassword('');
	}

	async function joinChannel(body: any, channelId: number) {
		const accessToken: string = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/join', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + accessToken,
			},
			body: JSON.stringify(body),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setChannels((prev) => {
						const newChannels = [...prev];
						const index = newChannels.findIndex(
							(c) => c.id == channelId,
						);
						newChannels[index].joined = true;
						return newChannels;
					});
					chatContext.messages.delete(channelId);
				} else {
					infoBoxContext.addInfo({
						type: InfoType.ERROR,
						message: data.reason,
					});
				}
			});
	}

	async function leaveChannel(channelId: number) {
		const accessToken: string = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/leave', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + accessToken,
			},
			body: JSON.stringify({
				channelId: channelId,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setChannels((prev) => {
						const newChannels = [...prev];
						const index = newChannels.findIndex(
							(c) => c.id == channelId,
						);
						newChannels[index].joined = false;
						if (props.joinType == ChannelJoinType.INVITED)
							newChannels.splice(index, 1);
						return newChannels;
					});
					if (channelId == props.selectedChannel)
						props.setSelectedChannel(0);
				}
			});
	}

	return (
		<div
			className={`channel-join-display ${
				!fetched && 'channel-join-fetching'
			}`}
		>
			{fetched ? (
				<div>
					{channels.map((c, i) => (
						<div
							key={c.id}
							className={`joinable-channel ${
								i == channels.length - 1 && 'last-channel'
							}`}
						>
							<div className="joinable-part joinable-left">
								<h2 className="joinable-name">{c.name}</h2>
								<img
									src={usersGroupIcon}
									alt="users group icon"
								/>
								<h2 className="joinable-members">
									{c.members} members
								</h2>
							</div>
							<div className="joinable-part joinable-right">
								{choose == c.id ? (
									<>
										<input
											type="password"
											placeholder="Enter password"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
										/>
										<Button
											onClick={joinWithPassword}
											color="#17c0e9"
										>
											Validate
										</Button>
									</>
								) : (
									<Button
										color={c.joined ? null : '#17c0e9'}
										onClick={
											c.joined
												? () => leaveChannel(c.id)
												: () =>
														joinWithoutPassword(
															c.id,
														)
										}
									>
										{c.joined ? 'Leave' : 'Join'}
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<Loader color="black" />
			)}
		</div>
	);
}

export default ChannelJoinDisplay;
