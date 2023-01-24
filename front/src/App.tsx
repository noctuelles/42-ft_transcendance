import AppRouter from './components/router/AppRouter';
import UserContextProvider from './context/UserContext';
import MessagesContextProvider from './context/MessagesContext';

function App() {
	return (
		<UserContextProvider>
			<MessagesContextProvider>
				<AppRouter />
			</MessagesContextProvider>
		</UserContextProvider>
	);
}

export default App;
