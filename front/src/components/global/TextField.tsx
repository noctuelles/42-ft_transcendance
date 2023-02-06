import { useField } from 'formik';
import '@/style/global/TextField.css';
import { useState } from 'react';

interface Props {
	label: string;
	helpText: string;
	id: string;
	type: string;
	name: string;
	placeholder?: string;
}

const TextField = ({ label, helpText, ...props }: Props) => {
	const [field, meta] = useField(props);
	const [didFocus, setDidFocus] = useState(false);
	const showFeedback =
		(didFocus && field.value.trim().length > 2) || meta.touched;

	return (
		<div
			className={`text-field ${
				showFeedback ? (meta.error ? 'invalid' : 'valid') : ''
			}`}
		>
			<div className="field-head">
				<label htmlFor={props.id}>{label}</label>
				{showFeedback ? (
					<div className="field-feedback" id={`${props.id}-feedback`}>
						{meta.error ? meta.error : '✓'}
					</div>
				) : null}{' '}
			</div>
			<input {...props} {...field} onFocus={() => setDidFocus(true)} />
			<div className="help-text" id={`${props.id}-help`}>
				<i>{helpText}</i>
			</div>
		</div>
	);
};

export default TextField;
