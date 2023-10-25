import AppRoutes from '../Routes';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../containers/MainPages/Login';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';

export default function Authentication() {
    const navigate = useNavigate()
    // Get User Details from Provider
    const { userDetail, token, clearToken } = useAuth()
    useEffect(() => {
        if (token) {
            navigate('/')
        }
        else {
            clearToken()
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Routes>
            {
                token && userDetail.role === 'admin' ?
                    <Route path="/*" element={<AppRoutes role={'admin'} />} />
                    :
                    token && userDetail.role === 'user' ?
                        <Route path="/*" element={<AppRoutes role={'user'} />} />
                        :
                        <Route path="/*" element={<Login />} />
            }
        </Routes >
    );
}