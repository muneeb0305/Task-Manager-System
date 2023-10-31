import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FetchData } from '../../utils/FetchData';
import { DeleteData } from '../../utils/DeleteData';
import { PostData } from '../../utils/PostData';
import { PutData } from '../../utils/PutData';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_USER, host } from '../../data/AppConstants';
import Alert from '../../components/Alert';
import { useAuth } from '..';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const navigate = useNavigate()
    // States
    const [taskList, setTaskList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    // Get all tasks by project id
    const fetchTaskByProjectId = useCallback(async (projectId) => {
        try {
            const TaskApi = `${host}/api/Tasks/project/${projectId}`;
            const res = await FetchData(TaskApi, token);
            setTaskList(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get all User tasks by UserId
    const fetchUserTaskById = useCallback(async (userId) => {
        try {
            const TaskApi = `${host}/api/Tasks/user/${userId}`;
            const res = await FetchData(TaskApi, token);
            setTaskList(res)    // for table
            setSelectedTask(res[0]) //for detail view
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get task by Task id
    const fetchTaskById = useCallback(async (taskId) => {
        try {
            const TaskApi = `${host}/api/Tasks/${taskId}`;
            const res = await FetchData(TaskApi, token);
            setSelectedTask(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])
    // remove task
    const remove = async (taskId) => {
        try {
            const deleteAPI = `${host}/api/Tasks/${taskId}`
            const res = await DeleteData(deleteAPI, token)
            const newData = taskList.filter(d => d.id !== taskId)
            setTaskList(newData);
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };
    // Create task
    const create = async (newTask) => {
        try {
            const CreateApi = `${host}/api/Tasks`
            const res = await PostData(CreateApi, newTask, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };
    // Update task
    const update = async (taskId, updatedTask) => {
        try {
            const UpdateApi = `${host}/api/Tasks/${taskId}`
            const res = await PutData(UpdateApi, updatedTask, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };
    // Assign task
    const assignTask = async (data) => {
        try {
            const UpdateApi = `${host}/api/Tasks/assign_task`
            const res = await PutData(UpdateApi, data, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // if role is user then update the task state with his/her tasks
    useEffect(() => {
        role === USER_ROLE_USER &&
            fetchUserTaskById(userDetail.ID)
    }, [role, fetchUserTaskById, userDetail])

    return (
        <TaskContext.Provider value={{ fetchUserTaskById, selectedTask, taskList, create, remove, update, fetchTaskByProjectId, fetchTaskById, assignTask }}>
            {children}
        </TaskContext.Provider>
    );
}