import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/Sidebar'
import { adminMenu, userMenu } from '../data/Menu'
import { Route, Routes } from 'react-router-dom'
import { routes } from '../data/routes'
import { useAuth } from '../context/AuthProvider'

export default function AppRoutes() {
    const { userDetail } = useAuth()
    const role = userDetail.role
    return (
        <SideBar Menus={role === 'admin' ? adminMenu : userMenu}>
            <Navbar />
            <Routes>
                {
                    routes.map((route, index) => {
                        if (role === 'admin' && (route.isAdmin || !route.isAdmin)
                        ) {
                            return (
                                <Route key={index} path={route.path} element={route.element} />
                            );
                        } else if (role === 'user' && !route.isAdmin) {
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
