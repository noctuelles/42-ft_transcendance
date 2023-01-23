import InfoBox from './components/global/InfoBox';
import AppRouter from './components/router/AppRouter';
import InfoBoxContextProvider from './context/InfoBoxContext';
import UserContextProvider from './context/UserContext';
import MessagesContextProvider from './context/MessagesContext';

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
