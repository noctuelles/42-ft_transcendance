import Button from '@/components/global/Button';
import '@/style/details/chat/Message.css';
import { InvitationStatus } from './IMessage';
import { back_url } from '@/config.json';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

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

	async function cancelInvitation() {
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/' + selectedChannel + '/invite/play', {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});
	}

	async function joinInvitation() {}

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
					{invitationStatus &&
						invitationStatus === InvitationStatus.PENDING && (
							<Button
								onClick={
									self ? cancelInvitation : joinInvitation
								}
								color={self ? '#ffb800' : '#17c0e9'}
							>
								{self ? 'Cancel' : 'Join'}
							</Button>
						)}
				</p>
			</div>
		</li>
	);
};

export default Message;
