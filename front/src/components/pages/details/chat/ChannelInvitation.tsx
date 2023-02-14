import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import IChannelInvitation from './IChannel';
import { back_url } from '@/config.json';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

interface IChannelInvitationProps {
	invitation: IChannelInvitation;
	channelId: number;
}

function ChannelInvitation(props: IChannelInvitationProps) {
	const userContext = useContext(UserContext);
	const infoBoxContext = useContext(InfoBoxContext);

	async function deleteInvitation() {
		const token = await userContext.getAccessToken();
		fetch(
			back_url +
				'/chat/channel/' +
				props.channelId +
				'/invitation/' +
				props.invitation.username,
			{
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			},
		)
			.then((res) => {
				if (!res.ok) {
					throw new Error('Impossible to delete invitation');
				}
			})
			.catch((err) => {
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: err.message,
				});
			});
	}

	return (
		<div className="user-on-channel">
			<img
				alt="profile picture"
				src={props.invitation.picture}
				style={{ filter: 'grayscale(100%)' }}
			/>
			<Link
				className="profile-link"
				to={`/profile/${props.invitation.username}`}
			>
				{props.invitation.username}
			</Link>
			<svg
				onClick={deleteInvitation}
				className="user-cross"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 320 512"
			>
				<path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
			</svg>
		</div>
	);
}

export default ChannelInvitation;
