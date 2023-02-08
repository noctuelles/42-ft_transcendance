import '@/style/global/Button.css';

const Button = (props: any) => {
	return (
		<button
			{...props}
			className="btn"
			type={props.type}
			onClick={props.onClick}
			style={{
				...(props.width && { width: `${props.width}` }),
				...(props.height && { height: `${props.height}` }),
				...(props.fontSize && { fontSize: `${props.fontSize}` }),
				...(props.fontWeight && {
					'font-weight': `${props.fontWeight}`,
				}),
				...(props.color
					? { backgroundColor: `${props.color}` }
					: { backgroundColor: '#ffb800' }),
			}}
		>
			{props.children}
		</button>
	);
};

export default Button;
