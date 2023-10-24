import React from 'react'
import Dashboard from '../containers/MainPages/Dashboard'
import Teams from '../containers/MainPages/Teams'
import AddTeam from '../containers/Forms/AddTeam'
import EnrollUser from '../containers/Forms/EnrollUser'
import Project from '../containers/MainPages/Projects'
import AddProject from '../containers/Forms/AddProject'
import AssignProject from '../containers/Forms/AssignProject'
import AssignTask from '../containers/Forms/AssignTask'
import ProjectDetail from '../containers/Detail/ProjectDetail'
import AddUser from '../containers/Forms/AddUser'
import UserDetail from '../containers/Detail/UserDetail'
import AddTask from '../containers/Forms/AddTask'
import TaskDetail from '../containers/Detail/TaskDetail'
import AddComment from '../containers/Forms/AddComment'
import Navbar from '../components/Navbar'
import SideBar from '../components/Sidebar'
import { adminMenu, userMenu } from '../data/Menu'
import { Route, Routes } from 'react-router-dom'
import Users from '../containers/MainPages/Users'
import TeamDetail from '../containers/Detail/TeamDetail'
import UserDashboard from '../containers/MainPages/UserDashboard'

export default function AppRoutes({ role }) {
    const routes = [
        {
            path: '/',
            element: <Dashboard />,
            isAdmin: true
        },
        {
            path: '/',
            element: <UserDashboard />,
            isAdmin: false
        },
        {
            path: '/team',
            element: <Teams />,
            isAdmin: true
        },
        {
            path: '/team/:id/edit',
            element: <AddTeam />,
            isAdmin: true
        },
        {
            path: '/team/create',
            element: <AddTeam />,
            isAdmin: true
        },
        {
            path: '/team/:id',
            element: <TeamDetail />,
            isAdmin: true
        },
        {
            path: '/team/:id/enroll',
            element: <EnrollUser />,
            isAdmin: true
        },
        {
            path: '/project',
            element: <Project />,
            isAdmin: true
        },
        {
            path: '/project/:id/edit',
            element: <AddProject />,
            isAdmin: true
        },
        {
            path: '/project/:id/assign',
            element: <AssignProject />,
            isAdmin: true
        },
        {
            path: '/project/:Pid/task/:Tid/assign',
            element: <AssignTask />,
            isAdmin: true
        },
        {
            path: '/project/:id',
            element: <ProjectDetail />,
            isAdmin: false
        },
        {
            path: '/project/create',
            element: <AddProject />,
            isAdmin: true
        },
        {
            path: '/user',
            element: <Users />,
            isAdmin: true
        },
        {
            path: '/user/create',
            element: <AddUser />,
            isAdmin: true
        },
        {
            path: '/user/:id/edit',
            element: <AddUser />,
            isAdmin: true
        },
        {
            path: '/user/:id',
            element: <UserDetail />,
            isAdmin: false
        },
        {
            path: '/project/:Pid/task/create',
            element: <AddTask />,
            isAdmin: true
        },
        {
            path: '/project/:Pid/task/:id/edit',
            element: <AddTask />,
            isAdmin: true
        },
        {
            path: '/project/:Pid/task/:id',
            element: <TaskDetail />,
            isAdmin: false
        },
        {
            path: '/project/:Pid/task/:Tid/comment/create',
            element: <AddComment />,
            isAdmin: true
        },
        {
            path: '/project/:Pid/task/:Tid/comment/:id/edit',
            element: <AddComment />,
            isAdmin: true
        }
    ]
    return (
        <>
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
        </>
    )
}
