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
import { adminMenu } from '../data/Menu'
import { Route, Routes } from 'react-router-dom'
import Users from '../containers/MainPages/Users'
import TeamDetail from '../containers/Detail/TeamDetail'

export default function AppRoutes() {
    const routes = [
        {
            path: '/',
            element: <Dashboard />,
        },
        {
            path: '/team',
            element: <Teams />,
        },
        {
            path: '/team/:id/edit',
            element: <AddTeam />,
        },
        {
            path: '/team/create',
            element: <AddTeam />,
        },
        {
            path: '/team/:id',
            element: <TeamDetail />,
        },
        {
            path: '/team/:id/enroll',
            element: <EnrollUser />,
        },
        {
            path: '/project',
            element: <Project />,
        },
        {
            path: '/project/:id/edit',
            element: <AddProject />,
        },
        {
            path: '/project/:id/assign',
            element: <AssignProject />,
        },
        {
            path: '/project/:Pid/task/:Tid/assign',
            element: <AssignTask />,
        },
        {
            path: '/project/:id',
            element: <ProjectDetail />,
        },
        {
            path: '/project/create',
            element: <AddProject />,
        },
        {
            path: '/user',
            element: <Users />,
        },
        {
            path: '/user/create',
            element: <AddUser />,
        },
        {
            path: '/user/:id/edit',
            element: <AddUser />,
        },
        {
            path: '/user/:id',
            element: <UserDetail />,
        },
        {
            path: '/project/:Pid/task/create',
            element: <AddTask />,
        },
        {
            path: '/project/:Pid/task/:id/edit',
            element: <AddTask />,
        },
        {
            path: '/project/:Pid/task/:id',
            element: <TaskDetail />,
        },
        {
            path: '/project/:Pid/task/:Tid/comment/create',
            element: <AddComment />,
        },
        {
            path: '/project/:Pid/task/:Tid/comment/:id/edit',
            element: <AddComment />,
        }
    ]
    return (
        <>
            <SideBar Menus={adminMenu}>
                <Navbar />
                <Routes>
                    {
                        routes.map((route, index) => {
                            return (
                                <Route key={index} path={route.path} element={route.element} />
                            );
                        })
                    }
                </Routes>
            </SideBar>
        </>
    )
}
