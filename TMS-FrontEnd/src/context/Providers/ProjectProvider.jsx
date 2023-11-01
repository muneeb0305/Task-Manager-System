import React, { createContext, useCallback, useEffect, useState } from 'react';
import { DeleteData, FetchData, PostData, PutData, handleError, handleSuccess } from '../../utils';
import { useAuth } from '..';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_ADMIN, USER_ROLE_USER, host } from '../../data/AppConstants';

export const ProjectContext = createContext();

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
    const role = userDetail && userDetail.role

    // Get All Projects
    const fetchProject = useCallback(async () => {
        try {
            const projectApi = `${host}/api/Project`
            const res = await FetchData(projectApi, token)
            setProjectList(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    //Get Project by Project Id
    const fetchProjectById = useCallback(async (projectId) => {
        try {
            const projectApi = `${host}/api/Project/${projectId}`;
            const res = await FetchData(projectApi, token);
            setSelectedProject(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    //Get User Project by User Id
    const fetchUserProjectById = useCallback(async (userId, projectId) => {
        try {
            const projectApi = `${host}/api/Project/user/${userId}`;
            const res = await FetchData(projectApi, token);
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
            const deleteAPI = `${host}/api/Project/${projectId}`
            const res = await DeleteData(deleteAPI, token)
            fetchProject()
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Create Project
    const create = async (newProject) => {
        try {
            const CreateApi = `${host}/api/Project`
            const res = await PostData(CreateApi, newProject, token)
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
            const UpdateApi = `${host}/api/Project/${projectId}`
            const res = await PutData(UpdateApi, editProject, token)
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
            const AssignApi = `${host}/api/Project/assign_project`
            const res = await PutData(AssignApi, data, token)
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