import { Outlet } from 'react-router';
import NavBar from '@/components/global/NavBar';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import Loader from './Loader';

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
				<div className="app">
					<NavBar />
					<main>
						<Outlet />
					</main>
					<footer></footer>
				</div>
			)}
		</div>
	);
}

export default LoggedApp;
