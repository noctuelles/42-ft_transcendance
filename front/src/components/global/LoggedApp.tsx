import { Outlet } from 'react-router';
import NavBar from '@/components/global/NavBar';

function LoggedApp() {
	return (
		<div className="logged">
			<NavBar />
			<Outlet />
		</div>
	);
}

export default LoggedApp;
