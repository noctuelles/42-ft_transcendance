import React, { useContext } from 'react';
import StatusDot from './StatusDot';
import IFriendData from './Types';
import '@/style/details/social/FriendItem.css';
import { Link } from 'react-router-dom';
import { back_url as BACK_URL } from '@/config.json';
import { UserContext } from '@/context/UserContext';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import MpButton from '../profile/MpButtons';

interface IProps {
	friend: IFriendData;
	setFriends: React.Dispatch<React.SetStateAction<IFriendData[] | null>>;
}

const linkStyle: React.CSSProperties = {
	textDecoration: 'none',
	fontSize: '1.3rem',
	letterSpacing: '0.03em',
	color: 'black',
};

const FriendItem = (props: IProps) => {
	const userContext = useContext(UserContext);
	const infoContext = useContext(InfoBoxContext);

	async function handleRemoveFriend() {
		const token = await userContext.getAccessToken();

		fetch(BACK_URL + '/users/friends/remove', {
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify({ username: props.friend.name }),
		})
			.then((response) => {
				if (!response.ok)
					return response.text().then((text) => {
						throw new Error(text);
					});
				if (response.ok) return response.json();
			})
			.then((response) => {
				props.setFriends(response);
			})
			.catch(() => {
				infoContext.addInfo({
					type: InfoType.ERROR,
					message: `Cannot remove friend ${props.friend.name}'`,
				});
			});
	}
	return (
		<li className="friend-item">
			<div className="friend-item-top">
				<img src={props.friend.profile.picture} draggable={false} />
				<Link to={`/profile/${props.friend.name}`} style={linkStyle}>
					{props.friend.name}
				</Link>
				<MpButton
					width="80px"
					fontSize="10px"
					withUserName={props.friend.name}
				/>
			</div>
			<div className="friend-item-center">
				<button onClick={handleRemoveFriend}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 320 512"
					>
						<path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
					</svg>
				</button>
				<StatusDot status={props.friend.status} />
			</div>
		</li>
	);
};

export default FriendItem;
