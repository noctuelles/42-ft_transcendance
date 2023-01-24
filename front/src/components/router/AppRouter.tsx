import InfoBoxContextProvider from '@/context/InfoBoxContext';
import { BrowserRouter as Router } from 'react-router-dom';
import InfoBox from '../global/InfoBox';
import AppRoutes from './AppRoutes';

function AppRouter() {
	return (
		<Router>
			<InfoBoxContextProvider>
				<InfoBox />
				<AppRoutes />
			</InfoBoxContextProvider>
		</Router>
	);
}

export default AppRouter;
