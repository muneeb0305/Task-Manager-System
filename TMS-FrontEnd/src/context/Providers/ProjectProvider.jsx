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
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    // Get Project
    const fetchProject = useCallback(async () => {
        try {
            const projectApi = `${host}/api/Project`
            const res = await FetchData(projectApi, token)
            setProjectList(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])
    //Get Project by Project Id
    const fetchProjectById = useCallback(async (id) => {
        try {
            const projectApi = `${host}/api/Project/${id}`;
            const res = await FetchData(projectApi, token);
            setSelectedProject(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    //Get User Project by User Id
    const fetchUserProjectById = useCallback(async (userId) => {
        try {
            const projectApi = `${host}/api/Project/user/${userId}`;
            const res = await FetchData(projectApi, token);
            setProjectList(res) //for table
            if (res.length > 0) {
                setSelectedProject(res[0])  //for detail view
            }
            else {
                navigate(- 1)
                throw Error()
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
            fetchProject()
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
            fetchProject()
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
            fetchProject()
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