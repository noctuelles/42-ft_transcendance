import { Navigate, Route, Routes } from 'react-router';
import LoggedApp from '../global/LoggedApp';
import FakePage1 from '../pages/FakePage1';
import FakePage2 from '../pages/FakePage2';
import Login from '../pages/Login';

const logged = true;

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={logged ? <Navigate to="/" /> : <Login />}
            />
            <Route
                path="/"
                element={logged ? <LoggedApp /> : <Navigate to="/login" />}
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
