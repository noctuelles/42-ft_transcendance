import '@/style/auth/TwoFa.css';
import { useEffect, useState } from 'react';
import TwoFaNumberInput from './TwoFaNumberInput';

interface ITwoFaInputProps {
	enabled: boolean;
	callback: (code: string) => void;
	onChange?: () => void;
	reset: boolean;
}

function TwoFaInput(props: ITwoFaInputProps) {
	const [code, setCode] = useState([-1, -1, -1, -1, -1, -1]);
	const [writing, setWriting] = useState(0);

	function onKeyPress(event: KeyboardEvent) {
		if (!props.enabled) return;
		if (props.onChange) props.onChange();
		if (event.key >= '0' && event.key <= '9') {
			if (writing < 6) {
				setCode((prev) => {
					prev[writing] = parseInt(event.key);
					return prev;
				});
				setWriting((prev) => prev + 1);
			}
		}
		if (event.key == 'Backspace') {
			if (writing > 0) {
				setCode((prev) => {
					prev[writing - 1] = -1;
					return prev;
				});
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
			setCode([-1, -1, -1, -1, -1, -1]);
		}
	}, [props.reset]);

	useEffect(() => {
		if (writing == 6) {
			props.callback(code.join(''));
		}
	}, [writing]);

	return (
		<div className="twofa-input">
			<TwoFaNumberInput value={code[0]} />
			<TwoFaNumberInput value={code[1]} />
			<TwoFaNumberInput value={code[2]} />
			<p>-</p>
			<TwoFaNumberInput value={code[3]} />
			<TwoFaNumberInput value={code[4]} />
			<TwoFaNumberInput value={code[5]} />
		</div>
	);
}

export default TwoFaInput;
