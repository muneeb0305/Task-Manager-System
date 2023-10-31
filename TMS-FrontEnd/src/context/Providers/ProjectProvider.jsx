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
        const projectApi = `${host}/api/Project`
        const res = await FetchData(projectApi, token)
        setProject(res)
    }, [token])
    //Get Project by Project Id
    const getProjectById = useCallback(async (id) => {
        const projectApi = `${host}/api/Project/${id}`;
        const res = await FetchData(projectApi, token);
        setSelectedProject(res)
    }, [token])
    //Get User Project by User Id
    const getUserProjectById = useCallback(async (id) => {
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
        // eslint-disable-next-line
    }, [token, userDetail])         //ignore navigate
    // Delete Project
    const removeProject = async (id) => {
        const deleteAPI = `${host}/api/Project/${id}`
        const res = await DeleteData(deleteAPI, token)
        getProject()
        return res
    };
    // Create Project
    const create = async (newProject) => {
        const CreateApi = `${host}/api/Project`
        const res = await PostData(CreateApi, newProject, token)
        getProject()
        return res
    };
    // Update Project
    const update = async (id, editProject) => {
        const UpdateApi = `${host}/api/Project/${id}`
        const res = await PutData(UpdateApi, editProject, token)
        getProject()
        return res
    };
    // Assign Project
    const assignProject = async (data) => {
        const AssignApi = `${host}/api/Project/assign_project`
        const res = await PutData(AssignApi, data, token)
        return res
    };

    // update project state according to user role
    useEffect(() => {
        // if role is admin then get all the projects
        role === USER_ROLE_ADMIN &&
            getProject()
                .catch((err) => Alert({ icon: 'error', title: err }))
        // if role is user then get only his/her project
        role === USER_ROLE_USER &&
            getUserProjectById()
                .catch((err) => Alert({ icon: 'error', title: err }))
    }, [role, getProject, getUserProjectById])

    return (
        <ProjectContext.Provider value={{ getUserProjectById, selectedProject, project, create, removeProject, update, getProjectById, getProject, assignProject }}>
            {children}
        </ProjectContext.Provider>
    );
}