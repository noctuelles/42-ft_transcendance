import { useContext, useEffect, useRef, useState } from 'react';
import { ChannelJoinType } from './ChannelJoinList';
import { back_url } from '@/config.json';
import { UserContext } from '@/context/UserContext';
import Loader from '@/components/global/Loader';

interface IJoinnableChannel {
	id: number;
	name: string;
	members: number;
	joined: boolean;
}

function ChannelJoinDisplay({ joinType }: { joinType: ChannelJoinType }) {
	const [channels, setChannels] = useState<IJoinnableChannel[]>([]);
	const [fetched, setFetched] = useState(false);
	const fetching = useRef(false);
	const userContext = useContext(UserContext);

	useEffect(() => {
		async function fetchData() {
			const token = await userContext.getAccessToken();
			fetch(
				back_url +
					'/chat/channels/' +
					joinType.toLowerCase().replace(' ', '-'),
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
	}, [joinType]);

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
							{c.name}
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
