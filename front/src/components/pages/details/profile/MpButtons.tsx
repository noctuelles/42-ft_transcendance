import Button from '@/components/global/Button';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import { back_url } from '@/config.json';
import { useNavigate } from 'react-router';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

interface IMpButtonProps {
	withUserName: string;
	blocked: boolean;
	blockedBy: boolean;
	width?: string;
	height?: string;
	fontSize?: string;
}

function MpButton(props: IMpButtonProps) {
	const userContext = useContext(UserContext);
	const infoBoxContext = useContext(InfoBoxContext);
	const navigate = useNavigate();

	async function openMp() {
		if (props.blocked) {
			infoBoxContext.addInfo({
				type: InfoType.ERROR,
				message: 'You blocked this user',
			});
			return;
		}
		if (props.blockedBy) {
			infoBoxContext.addInfo({
				type: InfoType.ERROR,
				message: 'You are blocked by this user',
			});
			return;
		}
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channels/mp/' + props.withUserName, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			if (res.ok) {
				navigate('/chat?mp=' + props.withUserName);
			}
		});
	}

	return (
		<div className="mp-button">
			<Button
				width={props.width}
				height={props.height}
				fontSize={props.fontSize}
				onClick={openMp}
				disabled={props.blocked || props.blockedBy}
				tooltip={
					props.blocked
						? 'You blocked this user'
						: props.blockedBy
						? 'You are blocked by this user'
						: ''
				}
			>
				Private message
			</Button>
		</div>
	);
}

export default MpButton;
