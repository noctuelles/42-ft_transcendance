import Button from '@/components/global/Button';
import '@/style/details/chat/Message.css';
import { InvitationStatus } from './IMessage';
import { back_url, ws_url as WS_URL } from '@/config.json';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import useWebSocket from 'react-use-websocket';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { useNavigate } from 'react-router';

interface IProps {
	from: string;
	content: string;
	self: boolean;
	isInvitation: boolean;
	invitationStatus?: InvitationStatus;
	selectedChannel: number;
}

const Message = ({
	from,
	content,
	self,
	isInvitation,
	invitationStatus,
	selectedChannel,
}: IProps) => {
	const userContext = useContext(UserContext);
	const infoBoxContext = useContext(InfoBoxContext);
	const navigate = useNavigate();

	async function cancelInvitation() {
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/' + selectedChannel + '/invite/play', {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			if (!res.ok) {
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: 'Failed to cancel invitation',
				});
			}
		});
	}

	async function joinInvitation() {
		const token = await userContext.getAccessToken();
		fetch(
			back_url +
				'/chat/channel/' +
				selectedChannel +
				'/invite/play/accept/' +
				from,
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			},
		).then((res) => {
			if (!res.ok) {
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: 'Failed to join invitation',
				});
			}
		});
	}

	function isSpectateMatchEvent(data: any): boolean {
		return data.event === 'spectate-match';
	}

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: (event) => {
			const data = JSON.parse(event.data);
			if (isSpectateMatchEvent(data)) {
				if (data.data.status == 'error') {
					infoBoxContext.addInfo({
						type: InfoType.ERROR,
						message: data.data.error,
					});
				} else if (data.data.status == 'success') {
					navigate(`/play?spectate`);
				}
			}
		},
		filter: ({ data }) => {
			return isSpectateMatchEvent(JSON.parse(data));
		},
	});

	async function spectateGame() {
		sendMessage(
			JSON.stringify({
				event: 'spectate-match-name',
				data: {
					name: from,
				},
			}),
		);
	}

	return (
		<li
			className={`${self ? 'self' : 'other'} ${
				isInvitation ? 'invitation' : 'msg'
			}`}
		>
			{self && <div className="notch" />}
			<div className="message">
				<address>{from}</address>
				<p className="main">
					{isInvitation ? 'Invited channel to play !' : content}
				</p>
				<p className="secondary">
					{invitationStatus === InvitationStatus.PENDING && (
						<Button
							onClick={self ? cancelInvitation : joinInvitation}
							color={self ? '#ffb800' : '#17c0e9'}
						>
							{self ? 'Cancel' : 'Join'}
						</Button>
					)}
					{invitationStatus === InvitationStatus.ACCEPTED &&
						'Match starting...'}
					{invitationStatus === InvitationStatus.PLAYING && (
						<Button
							color={self ? '#ffb800' : '#17c0e9'}
							onClick={spectateGame}
						>
							Spectate
						</Button>
					)}
				</p>
			</div>
		</li>
	);
};

export default Message;
