import { useState } from 'react';
import AppRouter from './components/router/AppRouter';
import { UserContext } from './context/UserContext';

function App() {
    const [logged, setLogged] = useState(false);
    const [access_token, setAccessToken] = useState('');

    function updateUser() {}

    function getAccessToken() {}

    return (
        <UserContext.Provider
            value={{
                auth: {
                    logged,
                    setLogged,
                    access_token,
                    setAccessToken,
                },
                updateUser,
                getAccessToken,
                id: -1,
                name: '',
            }}
        >
            <div className="App">
                <AppRouter />
            </div>
        </UserContext.Provider>
    );
}

export default App;
