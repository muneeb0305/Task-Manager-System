import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FetchData } from '../../utils/FetchData';
import { DeleteData } from '../../utils/DeleteData';
import { PostData } from '../../utils/PostData';
import { PutData } from '../../utils/PutData';
import { useAuth } from '..';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_ADMIN, USER_ROLE_USER, host } from '../../data/AppConstants';

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const navigate = useNavigate()
    // States
    const [project, setProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    // Get Project
    const getProject = useCallback(async () => {
        try {
            const projectApi = `${host}/api/Project`
            const res = await FetchData(projectApi, token)
            setProject(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])
    //Get Project by Project Id
    const getProjectById = useCallback(async (id) => {
        try {
            const projectApi = `${host}/api/Project/${id}`;
            const res = await FetchData(projectApi, token);
            setSelectedProject(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    //Get User Project by User Id
    const getUserProjectById = useCallback(async (id) => {
        try {
            const projectApi = `${host}/api/Project/user/${userDetail.ID}`;
            const res = await FetchData(projectApi, token);
            const userProjects = res.find(p => p.id === Number(id))
            setProject(res)
            if (id) {
                if (userProjects) {
                    setSelectedProject(userProjects)
                }
                else {
                    navigate(- 1)
                    throw Error()
                }
            }
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
        // eslint-disable-next-line
    }, [token, userDetail])         //ignore navigate

    // Delete Project
    const removeProject = async (id) => {
        try {
            const deleteAPI = `${host}/api/Project/${id}`
            const res = await DeleteData(deleteAPI, token)
            getProject()
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Create Project
    const create = async (newProject) => {
        try {
            const CreateApi = `${host}/api/Project`
            const res = await PostData(CreateApi, newProject, token)
            getProject()
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Update Project
    const update = async (id, editProject) => {
        try {
            const UpdateApi = `${host}/api/Project/${id}`
            const res = await PutData(UpdateApi, editProject, token)
            getProject()
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Assign Project
    const assignProject = async (data) => {
        try {
            const AssignApi = `${host}/api/Project/assign_project`
            const res = await PutData(AssignApi, data, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // update project state according to user role
    useEffect(() => {
        // if role is admin then get all the projects
        role === USER_ROLE_ADMIN &&
            getProject()
        // if role is user then get only his/her project
        role === USER_ROLE_USER &&
            getUserProjectById()
    }, [role, getProject, getUserProjectById])

    return (
        <ProjectContext.Provider value={{ getUserProjectById, selectedProject, project, create, removeProject, update, getProjectById, getProject, assignProject }}>
            {children}
        </ProjectContext.Provider>
    );
}