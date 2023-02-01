import '@/style/auth/TwoFa.css';

interface ITwoFaNumberInputProps {
	value: number;
}

function TwoFaNumberInput(props: ITwoFaNumberInputProps) {
	return (
		<div className="twofa-number">
			<p style={{ color: props.value == -1 ? 'transparent' : 'black' }}>
				{props.value}
			</p>
		</div>
	);
}

export default TwoFaNumberInput;
