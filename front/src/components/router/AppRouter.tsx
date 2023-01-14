import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function AppRouter() {
	return (
		<Router>
			<AppRoutes />
		</Router>
	);
}

export default AppRouter;
