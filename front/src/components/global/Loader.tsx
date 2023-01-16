import '@/style/Loader.css';
import { useEffect } from 'react';

export interface ILoaderProps {
	color: string;
}

function Loader(props: ILoaderProps) {
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--circle-color',
			props.color,
		);
	}, [props.color]);
	return (
		<div className="loader-circle" data-circle={props.color}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

export default Loader;
