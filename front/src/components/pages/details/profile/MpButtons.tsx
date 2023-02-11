import Button from '@/components/global/Button';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import { back_url } from '@/config.json';
import { useNavigate } from 'react-router';

interface IMpButtonProps {
	withUserName: string;
	width?: string;
	height?: string;
	fontSize?: string;
}

function MpButton(props: IMpButtonProps) {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	async function openMp() {
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
			>
				Private message
			</Button>
		</div>
	);
}

export default MpButton;
