import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/Sidebar'
import { adminMenu, userMenu } from '../data/Menu'
import { Route, Routes } from 'react-router-dom'
import { routes } from '../data/routes'
import { useAuth } from '../context'
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../data/AppConstants'
import NotFound from '../containers/MainPages/NotFound'

export default function AppRoutes() {
    const { userDetail } = useAuth()
    const { role } = userDetail

    const shouldRenderRoute = (route) => {
        if ((role === USER_ROLE_ADMIN && (route.isAdmin || !route.isAdmin)) || (role === USER_ROLE_USER && !route.isAdmin)) {
            return true;
        }
        return false;
    };

    return (
        <SideBar Menus={role === USER_ROLE_ADMIN ? adminMenu : userMenu}>
            <Navbar />
            <Routes>
                {
                    routes.map((route, index) => shouldRenderRoute(route) ?
                        <Route key={index} path={route.path} element={route.element} /> : null
                    )
                }
                <Route path={'/*'} element={<NotFound />} />
            </Routes>
        </SideBar>
    )
}
