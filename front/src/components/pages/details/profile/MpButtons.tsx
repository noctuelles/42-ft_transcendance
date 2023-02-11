import Button from '@/components/global/Button';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import { back_url } from '@/config.json';
import { useNavigate } from 'react-router';

function MpButton({ withUserName }: { withUserName: string }) {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	async function openMp() {
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channels/mp/' + withUserName, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			if (res.ok) {
				navigate('/chat?mp=' + withUserName);
			}
		});
	}

	return (
		<div className="mp-button">
			<Button onClick={openMp}>Private message</Button>
		</div>
	);
}

export default MpButton;
