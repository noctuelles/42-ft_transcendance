import '@/style/Chat.css';
import Button from '../global/Button';
import ChannelList from './details/channel/ChannelList';

export default function Chat() {
	return (
		<div className="chat-page">
			<div className="chat-page-left-side">
				<Button>Create new channel</Button>
				<hr />
				<ChannelList />
			</div>
			<div className="chat-page-center"></div>
			<div className="chat-page-right-side"></div>
		</div>
	);
}
