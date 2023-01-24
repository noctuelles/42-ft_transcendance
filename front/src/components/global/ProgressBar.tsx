import '@/style/global/ProgressBar.css';

interface ProgressBarProps {
	percent: number;
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
			}}
		>
			<div
				className="progress-bar-inner"
				style={{ width: `${props.percent}%` }}
			></div>
			<span className="progress-bar-text">{props.text}</span>
		</div>
	);
};

export default ProgressBar;
