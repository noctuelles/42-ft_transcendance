import { GameState, IPlayerInfo } from '../pages/Play';
import '@/style/play/Matchmaking.css';
import Loader from '../global/Loader';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';

interface IMatchmakingProps {
	setGameState: (gameState: GameState) => void;
	joinMatch: (player1: IPlayerInfo, player2: IPlayerInfo) => void;
}

function Matchmaking(props: IMatchmakingProps) {
	function isMatchmakingEvent(data: any) {
		return data.event === 'matchmaking' && data.data.action === 'match';
	}

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }) => {
			data = JSON.parse(data);
			if (isMatchmakingEvent(data)) {
				props.joinMatch(data.data.player1, data.data.player2);
			}
		},
		filter: ({ data }) => {
			return isMatchmakingEvent(JSON.parse(data));
		},
	});

	function cancelMatchmaking() {
		props.setGameState(GameState.LOBBY);
		sendMessage(
			JSON.stringify({
				event: 'matchmaking',
				data: { action: 'cancel' },
			}),
		);
	}

	return (
		<div className="matchmaking">
			<h1>Waiting for opponent...</h1>
			<Loader color="black" />
			<button className="matchmaking-btn" onClick={cancelMatchmaking}>
				Cancel
			</button>
		</div>
	);
}

export default Matchmaking;
