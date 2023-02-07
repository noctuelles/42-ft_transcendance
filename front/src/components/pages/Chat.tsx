import '@/style/Chat.css';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import * as Yup from 'yup';
import Button from '../global/Button';
import ChannelCreationForm from './details/channel/ChannelCreationForm';
import ChannelList from './details/channel/ChannelList';
import Message from './details/channel/Message';
import { ws_url as WS_URL } from '@/config.json';

interface IMessage {
	username: string;
	channel: number;
	message: string;
}

export default function Chat() {
	const [showCreationForm, setShowCreationForm] = useState(false);
	const [selectedChannel, setSelectedChannel] = useState<number>(0);
	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onOpen: () => {
			console.log('connection OK !');
		},
		onMessage: (e) => {
			console.log(e);
		},
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
				channel: 0,
				message: inputValue,
			};

			sendMessage(JSON.stringify({ event: 'chat', data: message }));
			resetForm();
		},
	});

	function handleNewChannelClick() {
		setShowCreationForm(true);
	}

	return !showCreationForm ? (
		<div className="chat-page">
			<div className="chat-page-left-side">
				<Button onClick={handleNewChannelClick}>
					Create new channel
				</Button>
				<hr />
				<ChannelList
					setSelectedChannel={setSelectedChannel}
					selectedChannel={selectedChannel}
				/>
			</div>
			<div className="chat-page-center">
				<ol className="chat-container">
					<Message
						from="plouvel"
						self={false}
						content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent est diam, ullamcorper eget ante blandit, gravida fringilla massa. Ut et magna congue turpis finibus sagittis. Cras ut urna sem. Donec vulputate quam vel sem ullamcorper, quis consectetur diam pharetra. Etiam congue lacus a tincidunt malesuada. Etiam cursus in massa vitae."
					/>
					<Message
						from="jmai"
						self={true}
						content="Hendrerit mollis orci urna eu libero. Nam."
					/>
					<Message
						from="jmai"
						self={true}
						content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin fringilla lacus non sodales. Curabitur.

"
					/>
					<Message from="jmai" self={true} content="Dolor sit amet" />
					<Message from="jmai" self={true} content="Dolor sit amet" />
				</ol>
				<form onSubmit={formik.handleSubmit}>
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
				</form>
			</div>
			<div className="chat-page-right-side">
				<h3>Channel name</h3>
			</div>
		</div>
	) : (
		<ChannelCreationForm setter={setShowCreationForm} />
	);
}
