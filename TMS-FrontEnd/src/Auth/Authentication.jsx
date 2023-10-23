import AppRoutes from '../Routes';
import { Route, Routes } from 'react-router-dom';
import Login from '../containers/MainPages/Login';
import { useAuth } from '../context/AuthProvider';

export default function Authentication() {
    const {token} = useAuth()   
    return (
        <Routes>
            {
                token ? <Route path="/*" element={<AppRoutes />} /> :
                    <Route path="/*" element={<Login />} />
            }
        </Routes >
    );
}