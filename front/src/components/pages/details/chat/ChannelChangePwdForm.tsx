import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import IChannel from './IChannel';
import { back_url as BACK_URL } from '@/config.json';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import TextField from '@/components/global/TextField';
import '@/style/details/chat/ChannelChangePwdForm.css';

interface IValues {
	password: string;
}

interface IProps {
	channel: IChannel;
}

const ChannelChangePwdForm = ({ channel }: IProps) => {
	const userContext = useContext(UserContext);
	const validation = Yup.object().shape({
		password: Yup.string()
			.max(25)
			.matches(/^[A-Za-z0-9_@./#&+-]*$/i, 'Invalid password'),
	});
	const values = {
		password: '',
	};

	async function handlePwdChange(
		values: IValues,
		{
			setFieldError,
			resetForm,
		}: {
			setFieldError: (field: string, errorMsg: string) => void;
			resetForm: () => void;
		},
	) {
		const token = await userContext.getAccessToken();
		fetch(BACK_URL + '/chat/channels/' + channel.id + '/chpwd', {
			method: 'PATCH',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify({
				channelPassword: values.password,
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
				setFieldError('password', errObj.message);
			});
	}

	return (
		<Formik
			validationSchema={validation}
			initialValues={values}
			onSubmit={handlePwdChange}
		>
			<Form className="invite-user-form">
				<TextField
					label="Password"
					id="password"
					name="password"
					helpText="Empty password removes it"
					type="password"
					placeholder="New password..."
				/>
				<button type="submit">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
					>
						<path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
					</svg>
				</button>
			</Form>
		</Formik>
	);
};

export default ChannelChangePwdForm;
