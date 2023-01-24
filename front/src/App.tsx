import AppRouter from './components/router/AppRouter';
import UserContextProvider from './context/UserContext';
import MessagesContextProvider from './context/MessagesContext';
import InfoBoxContextProvider from './context/InfoBoxContext';
import InfoBox from './components/global/InfoBox';

function App() {
	return (
		<UserContextProvider>
			<InfoBoxContextProvider>
				<MessagesContextProvider>
					<InfoBox />
					<AppRouter />
				</MessagesContextProvider>
			</InfoBoxContextProvider>
		</UserContextProvider>
	);
}

export default App;
