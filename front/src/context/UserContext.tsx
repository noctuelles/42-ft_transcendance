import jwtDecode from 'jwt-decode';
import React, { Children, useState } from 'react';

export const UserContext = React.createContext({
    auth: {
        logged: false,
        setLogged: (logged: boolean) => {},
        access_token: '',
        setAccessToken: (access_token: string) => {},
    },
    updateUser: () => {},
    getAccessToken: () => {},
    id: -1,
    name: '',
});

function UserContextProvider(props: any) {
    const [logged, setLogged] = useState(false);
    const [access_token, setAccessToken] = useState('');
    const [user, setUser] = useState({ id: -1, name: '' });

    async function updateUser() {
        const decode: any = jwtDecode(access_token);
        if (decode.exp < Date.now() / 1000) {
            // TODO refresh token
        }
        if (logged) {
            setUser({ id: decode.id, name: decode.name });
        }
    }

    async function getAccessToken() {}

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
                ...user,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
