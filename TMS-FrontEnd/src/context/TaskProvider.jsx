import React, { createContext, useContext, useEffect, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import { useAuth } from './AuthProvider';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const host = `https://localhost:7174`
    const navigate = useNavigate()
    const USER_ROLE_USER = 'user';
    // States
    const [task, setTask] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()

    const role = userDetail && userDetail.role

    useEffect(() => {
        if (role === USER_ROLE_USER) {
            getUserTask()
                .catch((err) => Alert({ icon: 'error', title: err }))
        }
        // eslint-disable-next-line
    }, [role])

    // Get all tasks by project id
    const getTaskByProjectId = async (id) => {
        const TaskApi = `${host}/api/Tasks/project/${id}`;
        const res = await FetchData(TaskApi, token);
        setTask(res)
    }
    // Get all tasks of User by UserId
    const getUserTask = async () => {
        const TaskApi = `${host}/api/Tasks/user/${userDetail.ID}`;
        const res = await FetchData(TaskApi, token);
        setTask(res)
    }
    // Get all User tasks by taskId
    const getUserTaskById = async (id) => {
        const TaskApi = `${host}/api/Tasks/user/${userDetail.ID}`;
        const res = await FetchData(TaskApi, token);
        const userTask = res.find(t => t.id === Number(id))
        if (userTask) {
            setSelectedTask(userTask)
        }
        else {
            navigate(-1)
            throw Error()
        }
    }
    // Get task by Task id
    const getTaskById = async (id) => {
        const TaskApi = `${host}/api/Tasks/${id}`;
        const res = await FetchData(TaskApi, token);
        setSelectedTask(res)
    }
    // remove task
    const remove = async (id) => {
        const deleteAPI = `${host}/api/Tasks/${id}`
        const res = await DeleteData(deleteAPI, token)
        const newData = task.filter(d => d.id !== id)
        setTask(newData);
        return res
    };
    // Create task
    const create = async (newTask) => {
        const CreateApi = `${host}/api/Tasks`
        const res = await PostData(CreateApi, newTask, token)
        return res
    };
    // Update task
    const update = async (id, updatedTask) => {
        const UpdateApi = `${host}/api/Tasks/${id}`
        const res = await PutData(UpdateApi, updatedTask, token)
        return res
    };
    // Assign task
    const assignTask = async (data) => {
        const UpdateApi = `${host}/api/Tasks/assign_task`
        const res = await PutData(UpdateApi, data, token)
        return res
    };
    return (
        <TaskContext.Provider value={{ getUserTaskById, getUserTask, selectedTask, task, create, remove, update, getTaskByProjectId, getTaskById, assignTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskData() {
    return useContext(TaskContext);
}
