import { ErrorMessage, Field, Form, Formik } from 'formik';
import '@/style/details/chat/ChannelCreationForm.css';
import * as Yup from 'yup';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import { back_url as BACK_URL } from '@/config.json';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

type ChannelRadioType = 'Public' | 'Private' | 'Password Protected';

interface IValues {
	channelName: string;
	channelPassword?: string;
	channelType: ChannelRadioType;
}

const msgMap = new Map<ChannelRadioType, string>([
	['Public', 'Everyone can join the channel'],
	['Private', 'User will be added upon your request'],
	['Password Protected', 'Everyone can join the channel - with a password'],
]);

export default function ChannelCreationForm({
	closeModal,
}: {
	closeModal: () => void;
}) {
	const validation = Yup.object().shape({
		channelName: Yup.string()
			.max(25, '25 characters or less')
			.min(10, 'At least 10 characters')
			.required('Requiered')
			.matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/i, 'Invalid channel name'),
		channelType: Yup.string().required('Requiered'),
		channelPassword: Yup.string().when('channelType', {
			is: 'Password Protected',
			then: Yup.string()
				.max(25, '25 characters or less')
				.min(10, 'At least 10 characters')
				.required('Requiered')
				.matches(/^[A-Za-z0-9_@./#&+-]*$/i, 'Invalid password'),
		}),
	});
	const values: IValues = {
		channelName: '',
		channelPassword: '',
		channelType: 'Public',
	};
	const userContext = useContext(UserContext);

	async function handleSubmit(
		values: IValues,
		{
			setFieldError,
		}: { setFieldError: (field: string, errorMsg: string) => void },
	) {
		const token = await userContext.getAccessToken();

		if (values.channelType !== 'Password Protected')
			delete values.channelPassword;

		const reqInit: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify(values),
		};

		fetch(BACK_URL + '/chat/channels/create', reqInit)
			.then((response) => {
				if (!response.ok)
					return response.text().then((text) => {
						throw new Error(text);
					});
				if (response.ok) closeModal();
			})
			.catch((err) => {
				const errObj = JSON.parse(err.message);
				setFieldError('channelName', errObj.message);
			});
	}

	return (
		<Formik
			initialValues={values}
			validationSchema={validation}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, values }) => (
				<Form
					className="channel-creation-form"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<h3>Create new channel</h3>
					<h4>Channel Info</h4>
					<TextField
						label="Name"
						id="channelName"
						name="channelName"
						helpText="Can contains only alphabetic characters separated by one space"
						type="text"
					/>
					{values.channelType === 'Password Protected' && (
						<>
							<TextField
								label="Password"
								id="channelPassword"
								name="channelPassword"
								helpText="Can only contains -_@./#&+ and alphanumeric characters"
								type="password"
							/>
						</>
					)}
					<h4>Channel type</h4>
					<div role="group" aria-labelledby="channel-type-radio">
						<label>
							<Field
								type="radio"
								name="channelType"
								value="Public"
							/>
							Public
						</label>
						<label>
							<Field
								type="radio"
								name="channelType"
								value="Private"
							/>
							Private
						</label>
						<label>
							<Field
								type="radio"
								name="channelType"
								value="Password Protected"
							/>
							Password Protected
						</label>
					</div>
					<div className="help-text">
						{msgMap.get(values.channelType)}
					</div>
					<div className="creation-form-btns">
						<Button onClick={closeModal}>Back</Button>
						<Button type="submit" disabled={isSubmitting}>
							Submit
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
}
