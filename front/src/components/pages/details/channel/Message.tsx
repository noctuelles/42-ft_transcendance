import '@/style/details/chat/Message.css';

interface IProps {
	from: string;
	content: string;
	self: boolean;
}

const Message = ({ from, content, self }: IProps) => {
	return (
		<li className={self ? 'self' : 'other'}>
			{self && <div className="notch" />}
			<div className="message">
				<address>{from}</address>
				<p>{content}</p>
			</div>
		</li>
	);
};

export default Message;
