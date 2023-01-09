import { Outlet } from 'react-router';
import Header from './Header';

function LoggedApp() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}

export default LoggedApp;
