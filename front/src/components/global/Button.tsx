import '@/style/global/Button.css';

const Button = (props: any) => {
	return (
		<button
			className="btn"
			type={props.type}
			onClick={props.onClick}
			style={{
				...(props.width && { width: `${props.width}` }),
				...(props.height && { width: `${props.height}` }),
				...(props.fontSize && { 'font-size': `${props.fontSize}` }),
				...(props.fontWeight && {
					'font-weight': `${props.fontWeight}`,
				}),
			}}
		>
			{props.children}
		</button>
	);
};

export default Button;
