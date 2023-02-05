import '@/style/Chat.css';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Button from '../global/Button';
import ChannelCreationForm from './details/channel/ChannelCreationForm';
import ChannelList from './details/channel/ChannelList';
import Message from './details/channel/Message';

export default function Chat() {
	const [showCreationForm, setShowCreationForm] = useState(false);
	const formik = useFormik({
		initialValues: {
			inputValue: '',
		},
		validationSchema: Yup.object().shape({
			inputValue: Yup.string().max(255).required(),
		}),
		onSubmit: (val) => {
			alert('bonjour' + val.inputValue);
		},
	});

	function handleNewChannelClick() {
		setShowCreationForm(true);
	}

	function submitMessage() {}

	return !showCreationForm ? (
		<div className="chat-page">
			<div className="chat-page-left-side">
				<Button onClick={handleNewChannelClick}>
					Create new channel
				</Button>
				<hr />
				<ChannelList />
			</div>
			<div className="chat-page-center">
				<ol className="chat-container">
					<Message
						from="plouvel"
						self={false}
						content="Ut at ante sit amet leo tempor varius ornare sit amet velit. Quisque."
					/>
					<Message from="jmai" self={true} content="Dolor sit amet" />
					<Message from="jmai" self={true} content="Dolor sit amet" />
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
