import { ErrorMessage, Field, Form, Formik } from 'formik';
import '@/style/details/chat/ChannelCreationForm.css';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import * as Yup from 'yup';

export default function ChannelCreationForm(props) {
	return (
		<div className="channel-creation-form">
			<Formik
				initialValues={{
					channelName: '',
					channelPassword: '',
					channelType: '',
				}}
				validationSchema={Yup.object({
					channelName: Yup.string()
						.max(25, 'Must be 25 characters or less')
						.min(10, 'Must be at least 10 characters')
						.required('Requiered')
						.matches(
							/^ ?[a-zA-Z]+(?: [a-zA-Z]+)*$/i,
							'Can only contain letters seperated by one space',
						),
					channelPassword: Yup.string()
						.max(25, 'Must be 25 characters or less')
						.min(10, 'Must be at least 10 characters')
						.required('Requiered'),
					channelType: Yup.string().required('Requiered'),
				})}
				onSubmit={() => {}}
			>
				{({ isSubmitting, values }) => (
					<Form className="channel-creation-form">
						<label htmlFor="channelName">Channel name : </label>
						<Field type="text" name="channelName" />
						<br />
						<ErrorMessage name="channelName" component="div" />
						{values.channelType == 'Password Protected' && (
							<>
								<label htmlFor="channelPassword">
									Channel password :
								</label>
								<Field type="password" name="channelPassword" />
								<br />
								<ErrorMessage
									name="channelPassword"
									component="div"
								/>
							</>
						)}
						Channel type :
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
						<button type="submit" disabled={isSubmitting}>
							Submit
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
}
