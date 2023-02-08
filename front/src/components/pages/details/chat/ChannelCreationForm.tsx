import { ErrorMessage, Field, Form, Formik } from 'formik';
import '@/style/details/chat/ChannelCreationForm.css';
import * as Yup from 'yup';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';

type ChannelRadioType = 'Public' | 'Private' | 'Password Protected';

interface IValues {
	channelName: string;
	channelPassword: string;
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

	async function handleSubmit(values: IValues) {
		//TODO: Hash the password before sending it to the API.
		const reqInit: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values, null, 2),
		};

		fetch('', reqInit);
		alert(JSON.stringify(values, null, 2));
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
