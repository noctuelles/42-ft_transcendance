import React, { useContext } from 'react';
import StatusDot from './StatusDot';
import '@/style/details/social/UserItem.css';
import { Link } from 'react-router-dom';
import { back_url as BACK_URL } from '@/config.json';
import { UserContext } from '@/context/UserContext';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import IUserData from './Types';
import MpButton from '../profile/MpButtons';

interface IProps {
	user: IUserData;
	removeEndpoint: string;
	showStatus: boolean;
	setUsers: React.Dispatch<React.SetStateAction<IUserData[] | null>>;
}

const linkStyle: React.CSSProperties = {
	textDecoration: 'none',
	fontSize: '1.3rem',
	letterSpacing: '0.03em',
	color: 'black',
};

const UserItem = (props: IProps) => {
	const userContext = useContext(UserContext);
	const infoContext = useContext(InfoBoxContext);

	async function handleRemoveUser() {
		const token = await userContext.getAccessToken();

		fetch(BACK_URL + props.removeEndpoint, {
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify({ username: props.user.name }),
		})
			.then((response) => {
				if (!response.ok)
					return response.text().then((text) => {
						throw new Error(text);
					});
				if (response.ok) return response.json();
			})
			.then((response) => {
				props.setUsers(response);
			})
			.catch(() => {
				infoContext.addInfo({
					type: InfoType.ERROR,
					message: `Cannot remove user ${props.user.name}'`,
				});
			});
	}
	return (
		<li className="user-item">
			<div className="user-item-top">
				<img src={props.user.profile.picture} draggable={false} />
				<Link to={`/profile/${props.user.name}`} style={linkStyle}>
					{props.user.name}
				</Link>
				{props.showStatus && (
					<MpButton
						width="80px"
						fontSize="10px"
						withUserName={props.user.name}
						blockedBy={props.user.blocked}
					/>
				)}
			</div>
			<div className="user-item-center">
				<button onClick={handleRemoveUser}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 320 512"
					>
						<path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
					</svg>
				</button>
				{props.showStatus && <StatusDot status={props.user.status!} />}
			</div>
		</li>
	);
};

export default UserItem;
