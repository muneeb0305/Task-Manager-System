import React, { createContext, useContext, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import { useAuth } from './AuthProvider';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    // States
    const [project, setProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()

    // Get Project
    const getProject = async () => {
        const projectApi = 'https://localhost:7174/api/Project'
        try{
            const res = await FetchData(projectApi, token)
            setProject(res)
        }
        catch(err){
            console.log(err)
        }
    }
    //Get Project by Project Id
    const getProjectById = async (id) => {
        const projectApi = `https://localhost:7174/api/Project/${id}`;
        const res = await FetchData(projectApi, token);
        setSelectedProject(res)
    }
    //Get User Project by User Id
    const getUserProjectById = async () => {
        const projectApi = `https://localhost:7174/api/Project/user/${userDetail.ID}`;
        const res = await FetchData(projectApi, token);
        setProject(res)
    }
    // Delete Project
    const remove = async (id) => {
        const deleteAPI = `https://localhost:7174/api/Project/${id}`
        await DeleteData(deleteAPI, token)
        getProject()
    };
    // Create Project
    const create = async (newProject) => {
        const CreateApi = `https://localhost:7174/api/Project`
        const res = await PostData(CreateApi, newProject, token)
        getProject()
        return res
    };
    // Update Project
    const update = async (id, editProject) => {
        const UpdateApi = `https://localhost:7174/api/Project/${id}`
        const res = await PutData(UpdateApi, editProject, token)
        getProject()
        return res
    };
    // Assign Project
    const assignProject = async (data) => {
        const AssignApi = `https://localhost:7174/api/Project/assign_project`
        const res = await PutData(AssignApi, data, token)
        return res
    };
    return (
        <ProjectContext.Provider value={{ getUserProjectById, selectedProject, project, create, remove, update, getProjectById, getProject, assignProject }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjectData() {
    return useContext(ProjectContext);
}
