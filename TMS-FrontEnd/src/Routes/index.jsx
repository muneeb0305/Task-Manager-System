import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/Sidebar'
import { adminMenu, userMenu } from '../data/Menu'
import { Route, Routes } from 'react-router-dom'
import { routes } from '../data/routes'
import { useAuth } from '../context/AuthProvider'

export default function AppRoutes() {
    const USER_ROLE_ADMIN = 'admin';
    const USER_ROLE_USER = 'user';
    const { userDetail } = useAuth()
    const role = userDetail.role
    return (
        <SideBar Menus={role === USER_ROLE_ADMIN ? adminMenu : userMenu}>
            <Navbar />
            <Routes>
                {
                    routes.map((route, index) => {
                        if ((role === USER_ROLE_ADMIN && (route.isAdmin || !route.isAdmin)) || (role === USER_ROLE_USER && !route.isAdmin)) {
                            return (
                                <Route key={index} path={route.path} element={route.element} />
                            );
                        }
                        return null
                    })
                }
            </Routes>
        </SideBar>
    )
}
