import React, { createContext, useCallback, useEffect, useState } from 'react';
import { create, fetch, remove, update } from '../../utils';
import { useAuth } from '..';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_ADMIN, USER_ROLE_USER, API_ENDPOINTS } from '../../data/AppConstants';
export const ProjectContext = createContext();

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

    // Functions Related to Project
    const fetchProject = useCallback(async () => {
        fetch(PROJECT_API, token)
            .then(res => setProjectList(res))
    }, [token])

    const fetchProjectById = useCallback(async (projectId) => {
        const API = `${PROJECT_API}/${projectId}`;
        fetch(API, token)
            .then(res => setSelectedProject(res))
    }, [token])

    const fetchUserProjectById = useCallback(async (userId, projectId) => {
        const API = `${PROJECT_API}/user/${userId}`;
        fetch(API, token)
            .then(res => {
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
            })
    }, [token, handleGoBack])

    const removeProject = async (projectId) => {
        const API = `${PROJECT_API}/${projectId}`
        remove(API, token)
            .then(() => fetchProject())
    };

    const createProject = async (newProject) => {
        create(PROJECT_API, token, newProject)
            .then(() => fetchProject(), handleGoBack())
    };

    const updateProject = async (projectId, editProject) => {
        const API = `${PROJECT_API}/${projectId}`
        update(API, token, editProject)
            .then(() => fetchProject(), handleGoBack())
    };

    const assignProject = async (data) => {
        const API = `${PROJECT_API}/assign_project`
        update(API, token, data)
            .then(() => fetchProject(), handleGoBack())
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
        <ProjectContext.Provider value={{ fetchUserProjectById, selectedProject, projectList, createProject, removeProject, updateProject, fetchProjectById, assignProject }}>
            {children}
        </ProjectContext.Provider>
    );
}