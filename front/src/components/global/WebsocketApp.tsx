import ChatContextProvider from '@/context/ChatContext';
import { Outlet, useNavigate } from 'react-router';
import NavBar from './NavBar';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL } from '@/config.json';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import SideBar from './SideBar';

function WebsocketApp() {
	const infoBoxContext = useContext(InfoBoxContext);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	useWebSocket(WS_URL, {
		share: true,
		onError: (event) => {
			userContext.auth.setUpdating(true);
			userContext.setUser({ id: -1, name: '', profile_picture: '' });
			infoBoxContext.addInfo({
				type: InfoType.ERROR,
				message:
					'Impossible to join backend. You can try again in a few seconds',
			});
		},
		onClose: (event) => {
			if (
				event.code !== 1001 &&
				event.code !== 1000 &&
				event.code !== 1005
			) {
				userContext.auth.setUpdating(true);
				userContext.setUser({ id: -1, name: '', profile_picture: '' });
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message:
						'Connection with backend lost. You can try again in a few seconds',
				});
			}
		},
		reconnectAttempts: 3,
		reconnectInterval: 6000,
		shouldReconnect: (closeEvent) => {
			if (
				closeEvent.code === 1001 ||
				closeEvent.code === 1000 ||
				closeEvent.code === 1005
			) {
				return false;
			}
			return true;
		},
		onOpen: () => {
			userContext.updateUser();
		},
		onMessage: (event) => {
			const data = JSON.parse(event.data);
			if (data.event == 'achievement') {
				infoBoxContext.addInfo({
					type: InfoType.SUCCESS,
					message:
						'You unlocked the achievement: ' +
						data.data.name +
						' and won ' +
						data.data.xp +
						' xp!',
				});
			}
			if (data.event == 'chat-invitation') {
				infoBoxContext.addInfo({
					type: InfoType.WARNING,
					message:
						data.data.inviter +
						' invited you to the channel ' +
						data.data.channel,
					onClick: () => {
						navigate('/chat');
					},
				});
			}
		},
	});

	return (
		<div className="app">
			<NavBar />
			<SideBar />
			<ChatContextProvider>
				<main>
					<Outlet />
				</main>
				<footer></footer>
			</ChatContextProvider>
		</div>
	);
}

export default WebsocketApp;
