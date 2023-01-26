import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import IMessage from './IMessage';
import { ws_url as WS_URL } from '@/config.json';

export default function UserInput({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	const [userInput, setUserInput] = useState('');
	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
	});
	return (
		<form onSubmit={onSubmit}>
			<input
				type="text"
				value={userInput}
				onChange={(event) => setUserInput(event.target.value)}
			/>
			<input type="submit" value="Send" />
		</form>
	);
	function onSubmit(e: any) {
		e.preventDefault();
		if (!userInput) {
			return;
		}
		const message: IMessage = {
			username: '', // TODO: We don't trust front anymore, so user field is going to be removed
			channel: selectedChannel,
			message: userInput,
		};
		const jsonMessage = { event: 'chat', data: message };
		sendMessage(JSON.stringify(jsonMessage));
		setUserInput('');
	}
}
