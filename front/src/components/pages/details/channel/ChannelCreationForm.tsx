import { ErrorMessage, Field, Form, Formik } from 'formik';
import '@/style/details/chat/ChannelCreationForm.css';
import * as Yup from 'yup';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import { useState } from 'react';

export default function ChannelCreationForm({
	setter,
}: {
	setter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const validation = Yup.object().shape({
		channelName: Yup.string()
			.max(25, '25 characters or less')
			.min(10, 'At least 10 characters')
			.required('Requiered')
			.matches(
				/^ ?[a-zA-Z]+(?: [a-zA-Z]+)*$/i,
				'Only one space per word',
			),
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

	return (
		<div className="channel-creation-form">
			<Formik
				initialValues={{
					channelName: '',
					channelPassword: '',
					channelType: 'Public',
				}}
				validationSchema={validation}
				onSubmit={() => {
					alert('lol');
				}}
			>
				{({ isSubmitting, values }) => (
					<Form className="channel-creation-form">
						<h3
							style={{
								textAlign: 'center',
								textDecoration: 'underline',
							}}
						>
							Create new channel
						</h3>
						<TextField
							label="Channel name"
							id="channelName"
							name="channelName"
							helpText="Can contains only alphabetic characters"
							type="text"
						/>
						{values.channelType === 'Password Protected' && (
							<>
								<TextField
									label="Channel password"
									id="channelPassword"
									name="channelPassword"
									helpText="Can only contains -_@./#&+ and alphanumeric characters"
									type="password"
								/>
							</>
						)}
						Channel type
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
						<div className="creation-form-btns">
							<Button onClick={() => setter(false)}>Back</Button>
							<Button type="submit" disabled={isSubmitting}>
								Submit
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}
