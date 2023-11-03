import React, { createContext, useCallback, useEffect, useState } from 'react';
import { HandleAPI, handleError, handleSuccess } from '../../utils';
import { useAuth } from '..';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_ADMIN, USER_ROLE_USER, HttpMethod, API_ENDPOINTS } from '../../data/AppConstants';
export const ProjectContext = createContext();

// API
const PROJECT_API = API_ENDPOINTS.PROJECT

export function ProjectProvider({ children }) {
    const navigate = useNavigate()
    const handleGoBack = useCallback(() => {
        navigate(-1);
        // eslint-disable-next-line
    }, []);             //ignore navigate

    // States
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail?.role

    // Get All Projects
    const fetchProject = useCallback(async () => {
        try {
            const API = `${PROJECT_API}`
            const res = await HandleAPI(API, HttpMethod.GET, token)
            setProjectList(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    //Get Project by Project Id
    const fetchProjectById = useCallback(async (projectId) => {
        try {
            const API = `${PROJECT_API}/${projectId}`;
            const res = await HandleAPI(API, HttpMethod.GET, token)
            setSelectedProject(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    //Get User Project by User Id
    const fetchUserProjectById = useCallback(async (userId, projectId) => {
        try {
            const API = `${PROJECT_API}/user/${userId}`;
            const res = await HandleAPI(API, HttpMethod.GET, token)
            setProjectList(res) //for table
            if (projectId) {
                const checkProject = res.find(p => p.id === Number(projectId))
                if (checkProject) {
                    setSelectedProject(checkProject)  //for detail view
                }
                else {
                    handleGoBack()
                }
            }
        } catch (err) {
            handleError(err)
        }
    }, [token, handleGoBack])

    // Delete Project
    const removeProject = async (projectId) => {
        try {
            const API = `${PROJECT_API}/${projectId}`
            const res = await HandleAPI(API, HttpMethod.DELETE, token)
            fetchProject()
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Create Project
    const create = async (newProject) => {
        try {
            const API = `${PROJECT_API}`
            const res = await HandleAPI(API, HttpMethod.POST, token, newProject)
            fetchProject()
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Update Project
    const update = async (projectId, editProject) => {
        try {
            const API = `${PROJECT_API}/${projectId}`
            const res = await HandleAPI(API, HttpMethod.PUT, token, editProject)
            fetchProject()
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Assign Project
    const assignProject = async (data) => {
        try {
            const API = `${PROJECT_API}/assign_project`
            const res = await HandleAPI(API, HttpMethod.PUT, token, data)
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // update project state according to user role
    useEffect(() => {
        // if role is admin then get all the projects
        role === USER_ROLE_ADMIN &&
            fetchProject()
        // if role is user then get only his/her project
        role === USER_ROLE_USER &&
            fetchUserProjectById(userDetail.ID)
    }, [role, fetchProject, fetchUserProjectById, userDetail])

    return (
        <ProjectContext.Provider value={{ fetchUserProjectById, selectedProject, projectList, create, removeProject, update, fetchProjectById, fetchProject, assignProject }}>
            {children}
        </ProjectContext.Provider>
    );
}