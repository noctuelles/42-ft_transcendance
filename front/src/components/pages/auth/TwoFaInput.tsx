import '@/style/auth/TwoFa.css';
import { useEffect, useState } from 'react';
import TwoFaNumberInput from './TwoFaNumberInput';

interface ITwoFaInputProps {
	code: number[];
	changeCode: (number: number, position: number) => void;
	available: boolean;
	reset: boolean;
}

function TwoFaInput(props: ITwoFaInputProps) {
	const [writing, setWriting] = useState(0);

	function onKeyPress(event: KeyboardEvent) {
		if (!props.available) return;
		if (event.key >= '0' && event.key <= '9') {
			if (writing < 6) {
				props.changeCode(parseInt(event.key), writing);
				setWriting((prev) => prev + 1);
			}
		}
		if (event.key == 'Backspace') {
			if (writing > 0) {
				setWriting((prev) => prev - 1);
			}
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', onKeyPress);
		return () => {
			window.removeEventListener('keydown', onKeyPress);
		};
	});

	useEffect(() => {
		if (props.reset) {
			setWriting(0);
		}
	}, [props.reset]);

	return (
		<div className="twofa-input">
			<TwoFaNumberInput value={props.code[0]} />
			<TwoFaNumberInput value={props.code[1]} />
			<TwoFaNumberInput value={props.code[2]} />
			<p>-</p>
			<TwoFaNumberInput value={props.code[3]} />
			<TwoFaNumberInput value={props.code[4]} />
			<TwoFaNumberInput value={props.code[5]} />
		</div>
	);
}

export default TwoFaInput;
