import React, { createContext, useContext, useEffect, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import { useAuth } from './AuthProvider';
import Alert from '../components/Alert';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const host = `https://localhost:7174`
    // States
    const [project, setProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    useEffect(() => {
        if (role === 'admin') {
            getProject()
                .catch((err) => Alert({ icon: 'error', title: err }))
        }
        else if (role === 'user') {
            getUserProjectById()
                .catch((err) => Alert({ icon: 'error', title: err }))
        }
        // eslint-disable-next-line
    }, [role])


    // Get Project
    const getProject = async () => {
        const projectApi = `${host}/api/Project`
        const res = await FetchData(projectApi, token)
        setProject(res)
    }
    //Get Project by Project Id
    const getProjectById = async (id) => {
        const projectApi = `${host}/api/Project/${id}`;
        const res = await FetchData(projectApi, token);
        setSelectedProject(res)
    }
    //Get User Project by User Id
    const getUserProjectById = async () => {
        const projectApi = `${host}/api/Project/user/${userDetail.ID}`;
        const res = await FetchData(projectApi, token);
        setProject(res)
    }
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
    return (
        <ProjectContext.Provider value={{ getUserProjectById, selectedProject, project, create, removeProject, update, getProjectById, getProject, assignProject }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjectData() {
    return useContext(ProjectContext);
}
