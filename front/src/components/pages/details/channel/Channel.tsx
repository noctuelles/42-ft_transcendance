import Button from '@/components/global/Button';
import '@/style/details/chat/Channel.css';

interface IProps {
	name: string;
}

const Channel = ({ name }: IProps) => {
	return (
		<li className="channel-list-item">
			<span>{name}</span>
			<Button>Join</Button>
		</li>
	);
};

export default Channel;
