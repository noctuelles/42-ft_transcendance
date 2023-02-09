import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';

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
			/>
			<button>Invite to play</button>
		</form>
	);
}
