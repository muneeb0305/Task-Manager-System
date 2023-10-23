import React, { createContext, useContext, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import { useToken } from './TokenProvider';

const TaskContext = createContext();

export function TaskProvider({ children }) {

    const [task, setTask] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const { token } = useToken()

    // Get all tasks by project id
    const getTaskByProjectId = async (id) => {
        const TaskApi = `https://localhost:7174/api/Tasks/project/${id}`;
        const res = await FetchData(TaskApi, token);
        setTask(res)
    }
    // Get task by Task id
    const getTaskById = async (id) => {
        const TaskApi = `https://localhost:7174/api/Tasks/${id}`;
        const res = await FetchData(TaskApi, token);
        setSelectedTask(res)
    }
    // remove task
    const remove = async (id) => {
        const deleteAPI = `https://localhost:7174/api/Tasks/${id}`
        await DeleteData(deleteAPI, token)
        const newData = task.filter(d => d.id !== id)
        setTask(newData);

    };
    // Create task
    const create = async (newTask) => {
        const CreateApi = `https://localhost:7174/api/Tasks`
        const res = await PostData(CreateApi, newTask, token)
        return res
    };
    // Update task
    const update = async (id, updatedTask) => {
        const UpdateApi = `https://localhost:7174/api/Tasks/${id}`
        const res = await PutData(UpdateApi, updatedTask, token)
        return res
    };
    // Assign task
    const assignTask = async (data) => {
        const UpdateApi = `https://localhost:7174/api/Tasks/assign_task`
        const res = await PutData(UpdateApi, data, token)
        return res
    };
    return (
        <TaskContext.Provider value={{ selectedTask, task, create, remove, update, getTaskByProjectId, getTaskById, assignTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskData() {
    return useContext(TaskContext);
}
