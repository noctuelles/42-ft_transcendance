import { useEffect, useState } from 'react';

interface ITimerProps {
	time: number;
}

function Timer(props: ITimerProps) {
	const [minutes, setMinutes] = useState('');
	const [seconds, setSeconds] = useState('');

	useEffect(() => {
		const sec = Math.floor(props.time % 60);
		const min = Math.floor(props.time / 60);
		setMinutes(min.toString().padStart(2, '0'));
		setSeconds(sec.toString().padStart(2, '0'));
	}, [props.time]);

	return (
		<p className="game-timer">
			{minutes}:{seconds}
		</p>
	);
}

export default Timer;
