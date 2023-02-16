import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ws_url as WS_URL, back_url } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

interface IMessage {
	username: string;
	channel: number;
	message: string;
}

export default function UserInput({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
	});
	const userContext = useContext(UserContext);
	const infoBoxContext = useContext(InfoBoxContext);

	const formik = useFormik({
		initialValues: {
			inputValue: '',
		},
		validationSchema: Yup.object().shape({
			inputValue: Yup.string().max(255).required(),
		}),
		onSubmit: async ({ inputValue }, { resetForm }) => {
			const message: IMessage = {
				username: '', // TODO: We don't trust front anymore, so user field is going to be removed
				channel: selectedChannel,
				message: inputValue,
			};

			sendMessage(JSON.stringify({ event: 'chat', data: message }));
			resetForm();
		},
	});

	async function sendInvite() {
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/' + selectedChannel + '/invite/play', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		})
			.then((res) => {
				if (res.ok) return res.json();
				else throw new Error('Error while inviting to play');
			})
			.then((data) => {
				if (!data.success) {
					infoBoxContext.addInfo({
						type: InfoType.ERROR,
						message: data.reason,
					});
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
		<form onSubmit={formik.handleSubmit} className="chat-user-input">
			<input
				className="textarea"
				type="text"
				name="inputValue"
				id="inputValue"
				placeholder="Type your message here..."
				onChange={formik.handleChange}
				value={formik.values.inputValue}
				maxLength={255}
				disabled={selectedChannel === 0}
			/>
			<button
				className="chat-btn1"
				type="submit"
				disabled={selectedChannel === 0}
			>
				Send
			</button>
			<button
				className="chat-btn2"
				type="button"
				onClick={sendInvite}
				disabled={selectedChannel === 0}
			>
				Invite to play
			</button>
		</form>
	);
}
