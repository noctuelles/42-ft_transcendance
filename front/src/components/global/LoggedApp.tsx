import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import Loader from './Loader';
import WebsocketApp from './WebsocketApp';

function LoggedApp() {
	const [ready, setReady] = useState(false);
	const userContext = useContext(UserContext);

	useEffect(() => {
		if (userContext.user.name !== '') {
			setReady(true);
		} else {
			setReady(false);
		}
	}, [userContext.user.name]);

	return (
		<div className="logged">
			{!ready ? (
				<div className="app-loading">
					<Loader color="black" />
					<p>Data loading... Please wait</p>
				</div>
			) : (
				<WebsocketApp />
			)}
		</div>
	);
}

export default LoggedApp;
