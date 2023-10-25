import ProjectDetail from "../containers/Detail/ProjectDetail";
import TaskDetail from "../containers/Detail/TaskDetail";
import TeamDetail from "../containers/Detail/TeamDetail";
import UserDetail from "../containers/Detail/UserDetail";
import AddComment from "../containers/Forms/AddComment";
import AddProject from "../containers/Forms/AddProject";
import AddTask from "../containers/Forms/AddTask";
import AddTeam from "../containers/Forms/AddTeam";
import AddUser from "../containers/Forms/AddUser";
import AssignProject from "../containers/Forms/AssignProject";
import AssignTask from "../containers/Forms/AssignTask";
import EnrollUser from "../containers/Forms/EnrollUser";
import Dashboard from "../containers/MainPages/Dashboard";
import UserDashboard from "../containers/MainPages/UserDashboard";
import View from "../containers/MainPages/View";

export const routes = [
    // Admin Dashboard
    {
        path: '/',
        element: <Dashboard />,
        isAdmin: true
    },
    //User Dashboard
    {
        path: '/',
        element: <UserDashboard />,
        isAdmin: false
    },
    // Team Routes
    {
        path: '/team/create',
        element: <AddTeam />,
        isAdmin: true
    },
    {
        path: '/team',
        element: <View display={'team'} />,
        isAdmin: false
    },
    {
        path: '/team/:TeamId',
        element: <TeamDetail />,
        isAdmin: false
    },
    {
        path: '/team/:TeamId/user/:UserId',
        element: <UserDetail />,
        isAdmin: false
    },
    {
        path: '/team/:TeamId/edit',
        element: <AddTeam />,
        isAdmin: true
    },
    {
        path: '/team/:TeamId/enroll',
        element: <EnrollUser />,
        isAdmin: true
    },
    // Project Routes
    {
        path: '/project',
        element: <View display={'project'} />,
        isAdmin: true
    },
    {
        path: '/project/:ProjectId/edit',
        element: <AddProject />,
        isAdmin: true
    },
    {
        path: '/project/:ProjectId/assign',
        element: <AssignProject />,
        isAdmin: true
    },
    {
        path: '/project/:ProjectId',
        element: <ProjectDetail />,
        isAdmin: false
    },
    {
        path: '/project/create',
        element: <AddProject />,
        isAdmin: true
    },
    // Task Routes
    {
        path: '/project/:ProjectId/task/:taskId/assign',
        element: <AssignTask />,
        isAdmin: true
    },
    {
        path: '/project/:ProjectId/task/create',
        element: <AddTask />,
        isAdmin: true
    },
    {
        path: '/project/:ProjectId/task/:taskId/edit',
        element: <AddTask />,
        isAdmin: false
    },
    {
        path: '/project/:ProjectId/task/:taskId',
        element: <TaskDetail />,
        isAdmin: false
    },
    //  Comment Routes
    {
        path: '/project/:ProjectId/task/:taskId/comment/create',
        element: <AddComment />,
        isAdmin: false
    },

    {
        path: '/project/:ProjectId/task/:taskId/comment/:id/edit',
        element: <AddComment />,
        isAdmin: false
    },
    // User Routes
    {
        path: '/user',
        element: <View display={'user'} />,
        isAdmin: true
    },
    {
        path: '/user/create',
        element: <AddUser />,
        isAdmin: true
    },
    {
        path: '/user/:UserId/edit',
        element: <AddUser />,
        isAdmin: true
    },
    {
        path: '/user/:UserId',
        element: <UserDetail />,
        isAdmin: false
    }
]