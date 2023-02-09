import Button from '@/components/global/Button';
import Loader from '@/components/global/Loader';
import '@/style/details/chat/Message.css';
import { InvitationStatus } from './IMessage';

interface IProps {
	from: string;
	content: string;
	self: boolean;
	isInvitation: boolean;
	invitationStatus?: InvitationStatus;
}

const Message = ({
	from,
	content,
	self,
	isInvitation,
	invitationStatus,
}: IProps) => {
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
							<Button color={self ? '#ffb800' : '#17c0e9'}>
								{self ? 'Cancel' : 'Join'}
							</Button>
						)}
				</p>
			</div>
		</li>
	);
};

export default Message;
