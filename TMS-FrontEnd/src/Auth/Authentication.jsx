import AppRoutes from '../Routes';
import { Route, Routes } from 'react-router-dom';
import { useToken } from '../context/TokenProvider';
import Login from '../containers/MainPages/Login';

export default function Authentication() {
    const {token} = useToken()   
    return (
        <Routes>
            {
                token ? <Route path="/*" element={<AppRoutes />} /> :
                    <Route path="/*" element={<Login />} />
            }
        </Routes >
    );
}