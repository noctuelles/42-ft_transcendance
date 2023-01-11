import InfoBox from './components/global/InfoBox';
import AppRouter from './components/router/AppRouter';
import InfoBoxContextProvider from './context/InfoBoxContext';
import UserContextProvider from './context/UserContext';

function App() {
    return (
        <UserContextProvider>
            <InfoBoxContextProvider>
                <InfoBox />
                <AppRouter />
            </InfoBoxContextProvider>
        </UserContextProvider>
    );
}

export default App;
