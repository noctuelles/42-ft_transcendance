import { useEffect, useState } from 'react';
import { back_url } from '../../config.json';

function Login() {
    const [authUrl, setAuthUrl] = useState('');
    useEffect(() => {
        fetch(back_url + '/auth')
            .then((res) => {
                if (res.ok) return res.json();
                //TODO Error message
            })
            .then((data) => {
                setAuthUrl(data.url);
            });
    }, [setAuthUrl]);

    function redirectToAuth() {
        if (authUrl !== '') window.location.replace(authUrl);
    }

    return (
        <div className="login">
            <button onClick={redirectToAuth}>Se connecter avec 42</button>
        </div>
    );
}

export default Login;
