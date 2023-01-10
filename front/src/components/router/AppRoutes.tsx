import React, { useRef } from 'react';
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router';
import LoggedApp from '../global/LoggedApp';
import FakePage1 from '../pages/FakePage1';
import FakePage2 from '../pages/FakePage2';
import Login from '../pages/Login';
import { back_url } from '../../config.json';
import { UserContext } from '../../context/UserContext';
import Cookies from 'js-cookie';

function AppRoutes() {
    const location = useLocation();
    const navigate = useNavigate();
    const fetching = useRef(false);
    const userContext = React.useContext(UserContext);
    const logged = userContext.auth.logged;

    React.useEffect(() => {
        if (location.pathname === '/callback') {
            const code = new URLSearchParams(location.search).get('code');
            if (code && !fetching.current) {
                fetching.current = true;
                userContext.auth.setUpdating(true);
                fetch(back_url + '/auth/callback?code=' + code, {
                    method: 'POST',
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        userContext.auth.setLogged(true);
                        userContext.auth.setAccessToken(
                            data.access_token.token,
                        );
                        Cookies.set(
                            'transcendance_session_cookie',
                            data.refresh_token.token,
                            {
                                expires: 7 * 24 * 60 * 60,
                            },
                        );
                        userContext.auth.setUpdating(false);
                        navigate('/');
                    });
            }
        }
        userContext.updateUser();
    }, [location, logged]);

    return (
        <Routes>
            <Route path="/callback" element={<div></div>} />
            <Route
                path="/login"
                element={
                    userContext.auth.logged && !userContext.auth.updating ? (
                        <Navigate to="/" />
                    ) : (
                        <Login />
                    )
                }
            />
            <Route
                path="/"
                element={
                    userContext.auth.logged || userContext.auth.updating ? (
                        <LoggedApp />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                <Route index element={<Navigate to="page1" />} />
                <Route path="page1" element={<FakePage1 />} />
                <Route path="page2" element={<FakePage2 />} />
                <Route path="*" element={<Navigate to="page1" />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;
