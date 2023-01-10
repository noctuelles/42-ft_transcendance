import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import React, { useState } from 'react';
import { back_url } from '../config.json';

export const UserContext = React.createContext({
    auth: {
        logged: false,
        setLogged: (logged: boolean) => {},
        setAccessToken: (access_token: string) => {},
        updating: false,
        setUpdating: (updating: boolean) => {},
    },
    updateUser: () => {},
    getAccessToken: () => {},
});

function UserContextProvider(props: any) {
    const [logged, setLogged] = useState(false);
    const [updating, setUpdating] = useState(true);
    const [access_token, setAccessToken] = useState('');
    const [user, setUser] = useState({ id: -1, name: '' });

    async function refreshToken(): Promise<boolean> {
        const refresh_token = Cookies.get('transcendance_session_cookie');
        if (!refresh_token) {
            return false;
        } else {
            const res = await fetch(back_url + '/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: refresh_token,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.access_token) {
                    setAccessToken(data.access_token.token);
                    let decode: any = jwtDecode(data.access_token.token);
                    setUser({ id: decode.user.id, name: decode.user.name });
                    setLogged(true);
                    Cookies.remove('transcendance_session_cookie');
                    Cookies.set(
                        'transcendance_session_cookie',
                        data.refresh_token.token,
                        {
                            expires: 7 * 24 * 60 * 60,
                        },
                    );
                } else {
                    Cookies.remove('transcendance_session_cookie');
                    return false;
                }
            } else {
                //TODO Error message
                Cookies.remove('transcendance_session_cookie');
                return false;
            }
        }
        return true;
    }

    async function updateUser() {
        setUpdating(true);
        if (access_token === '') {
            if ((await refreshToken()) === false) {
                setLogged(false);
                setUser({ id: -1, name: '' });
                setAccessToken('');
                setUpdating(false);
                return;
            }
        } else {
            let decode: any = jwtDecode(access_token);
            if (decode.exp < Date.now() / 1000) {
                if ((await refreshToken()) === false) {
                    setLogged(false);
                    setUser({ id: -1, name: '' });
                    setAccessToken('');
                    setUpdating(false);
                    return;
                }
            }
            setUser({ id: decode.user.id, name: decode.user.name });
        }
        setUpdating(false);
    }

    async function getAccessToken() {
        await updateUser();
        return access_token;
    }

    return (
        <UserContext.Provider
            value={{
                auth: {
                    logged,
                    setLogged,
                    setAccessToken,
                    updating,
                    setUpdating,
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
