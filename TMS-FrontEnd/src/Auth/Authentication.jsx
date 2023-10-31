import AppRoutes from '../Routes';
import { Route, Routes } from 'react-router-dom';
import Login from '../containers/MainPages/Login';
import { useAuth } from '../context';

export default function Authentication() {
    // Get Token from Provider
    const { token } = useAuth()
    return (
        <Routes>
            {
                token ?
                    // User is authenticated, render AppRoutes
                    <Route path="/*" element={<AppRoutes />} />
                    :
                    // User is not authenticated, render the login page
                    <Route path="/*" element={<Login />} />
            }
        </Routes >
    );
}