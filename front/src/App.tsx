import AppRouter from './components/router/AppRouter';
import UserContextProvider from './context/UserContext';
import InfoBoxContextProvider from './context/InfoBoxContext';
import InfoBox from './components/global/InfoBox';

function App() {
	return (
		<InfoBoxContextProvider>
			<UserContextProvider>
				<InfoBox />
				<AppRouter />
			</UserContextProvider>
		</InfoBoxContextProvider>
	);
}

export default App;
