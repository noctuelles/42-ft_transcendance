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
	const containerStyle: React.CSSProperties = {
		width: props.width ? props.width : '100%',
		height: props.height ? props.height : '1.5rem',
		backgroundColor: props.barColor ? props.barColor : 'darkgray',
	};
	const progressBarInnerStyle: React.CSSProperties = {
		width: `${props.percent}%`,
		backgroundColor: props.innerBarColor ? props.innerBarColor : '#3399ff',
	};

	return (
		<div className="progress-bar-container" style={containerStyle}>
			<div
				className="progress-bar-inner"
				style={progressBarInnerStyle}
				data-value={props.text}
			></div>
		</div>
	);
};

export default ProgressBar;
