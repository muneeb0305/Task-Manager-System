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
    const [task, setTask] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    // Get all tasks by project id
    const getTaskByProjectId = useCallback(async (id) => {
        const TaskApi = `${host}/api/Tasks/project/${id}`;
        const res = await FetchData(TaskApi, token);
        setTask(res)
    }, [token])
    // Get all tasks of User by UserId
    const getUserTask = async () => {
        const TaskApi = `${host}/api/Tasks/user/${userDetail.ID}`;
        const res = await FetchData(TaskApi, token);
        setTask(res)
    }
    // Get all User tasks by taskId
    const getUserTaskById = useCallback(async (id) => {
        const TaskApi = `${host}/api/Tasks/user/${userDetail.ID}`;
        const res = await FetchData(TaskApi, token);
        setTask(res)
        const userTask = res.find(t => t.id === Number(id))
        if (id) {
            if (userTask) {
                setSelectedTask(userTask)
            }
            else {
                navigate(-1)
                throw Error()
            }
        }
        // eslint-disable-next-line
    }, [token, userDetail])          //ignore navigate
    // Get task by Task id
    const getTaskById = useCallback(async (id) => {
        const TaskApi = `${host}/api/Tasks/${id}`;
        const res = await FetchData(TaskApi, token);
        setSelectedTask(res)
    }, [token])
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

    // if role is user then update the task state with his/her tasks
    useEffect(() => {
        role === USER_ROLE_USER &&
            getUserTaskById()
                .catch((err) => Alert({ icon: 'error', title: err }))
    }, [role, getUserTaskById])

    return (
        <TaskContext.Provider value={{ getUserTaskById, getUserTask, selectedTask, task, create, remove, update, getTaskByProjectId, getTaskById, assignTask }}>
            {children}
        </TaskContext.Provider>
    );
}