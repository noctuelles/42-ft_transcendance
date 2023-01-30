import '@/style/global/ProgressBar.css';

interface ProgressBarProps {
	percent: number;
	barColor?: string;
	innerBarColor?: string;
	height?: string;
	width?: string;
	text?: string;
}

const ProgressBar = (props: ProgressBarProps) => {
	return (
		<div
			className="progress-bar-container"
			style={{
				width: props.width ? props.width : '100%',
				height: props.height ? props.height : '25px',
				backgroundColor: props.barColor ? props.barColor : 'darkgray',
			}}
		>
			<div
				className="progress-bar-inner"
				style={{
					width: `${props.percent}%`,
					backgroundColor: props.innerBarColor
						? props.innerBarColor
						: '#3399ff',
				}}
			>
				<span className="progress-bar-text">{props.text}</span>
			</div>
		</div>
	);
};

export default ProgressBar;
