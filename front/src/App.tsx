import AppRouter from './components/router/AppRouter';
import UserContextProvider from './context/UserContext';

function App() {
    return (
        <UserContextProvider>
            <div className="App">
                <AppRouter />
            </div>
        </UserContextProvider>
    );
}

export default App;
