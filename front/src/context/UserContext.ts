import React from 'react';

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
