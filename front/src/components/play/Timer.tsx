import { useEffect, useState } from 'react';

interface ITimerProps {
	time: number;
}

function Timer(props: ITimerProps) {
	const [minutes, setMinutes] = useState('');
	const [seconds, setSeconds] = useState('');
	const [prolongation, setProlongation] = useState(false);

	useEffect(() => {
		if (props.time < 0) {
			setProlongation(true);
		}
		const sec = Math.floor(Math.abs(props.time) % 60);
		const min = Math.floor(Math.abs(props.time) / 60);
		setMinutes(min.toString().padStart(2, '0'));
		setSeconds(sec.toString().padStart(2, '0'));
	}, [props.time]);

	return (
		<p className={`game-timer ${prolongation && 'timer-prolongation'}`}>
			{prolongation ? '+' : ''}
			{minutes}:{seconds}
		</p>
	);
}

export default Timer;
