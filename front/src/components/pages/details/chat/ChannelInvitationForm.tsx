import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import IChannel from './IChannel';
import {back_url as BACK_URL} from '@/config.json'
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import TextField from '@/components/global/TextField';

interface IValues {
	username: string;
}

interface IProps {
	channel: IChannel;
}

const ChannelInvitationForm = ({ channel }: IProps) => {
	const userContext = useContext(UserContext);

	const validation = Yup.object().shape({
		username: Yup.string().required('Requiered'),
	});
	const values = {
		username: '',
	};

	async function handleInvit(
		values: IValues,
		{
			setFieldError,
			resetForm,
		}: {
			setFieldError: (field: string, errorMsg: string) => void;
			resetForm: () => void;
		},
	) {
		if (!channel) return;
		const token = await userContext.getAccessToken();
		fetch(BACK_URL + '/chat/channel/' + channel.id + '/invite', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify({
				username: values.username,
			}),
		})
			.then((res) => {
				if (!res.ok)
					return res.text().then((text) => {
						throw new Error(text);
					});
				resetForm();
			})
			.catch((err) => {
				const errObj = JSON.parse(err.message);
				setFieldError('username', errObj.message);
			});
	}
	return (
		<Formik
			validationSchema={validation}
			initialValues={values}
			onSubmit={handleInvit}
		>
			<Form className="invite-user-form">
				<TextField
					label="Username"
					id="username"
					name="username"
					helpText="Invite somebody"
					type="text"
					placeholder="username"
				/>
				<button type="submit">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 512"
					>
						<path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
					</svg>
				</button>
			</Form>
		</Formik>
	);
}

export default ChannelInvitationForm;
