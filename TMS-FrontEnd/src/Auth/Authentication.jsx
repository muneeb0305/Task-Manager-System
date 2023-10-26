import AppRoutes from '../Routes';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../containers/MainPages/Login';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';

export default function Authentication() {
    const navigate = useNavigate()
    // Get Token from Provider
    const { token } = useAuth()

    // If user tries to change or reload the page
    useEffect(() => {
        navigate('/')
        // eslint-disable-next-line
    }, [])

    return (
        <Routes>
            {
                token ?
                    <Route path="/*" element={<AppRoutes />} />
                    :
                    <Route path="/*" element={<Login />} />
            }
        </Routes >
    );
}