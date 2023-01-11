import InfoBox from './components/global/InfoBox';
import AppRouter from './components/router/AppRouter';
import InfoBoxContextProvider from './context/InfoBoxContext';
import UserContextProvider from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

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
