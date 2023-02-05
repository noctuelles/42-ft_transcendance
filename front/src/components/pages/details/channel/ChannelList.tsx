import '@/style/details/chat/ChannelList.css';
import Channel from './Channel';

// s'occupe de recuperer les channels (voir le code de Jeremy)

const chan = [{ name: 'Le channel' }, { name: 'Le Channel' }];

export default function ChannelList() {
	return (
		<ul className="channel-list">
			{chan.map((c) => (
				<Channel key={c.name} name={c.name} />
			))}
		</ul>
	);
}
