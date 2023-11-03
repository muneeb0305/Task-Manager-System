import React, { createContext, useCallback, useEffect, useState } from 'react';
import { create, fetch, remove, update } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, USER_ROLE_USER } from '../../data/AppConstants';
import { useAuth } from '..';
export const TaskContext = createContext();

const TASK_API = API_ENDPOINTS.TASK

export function TaskProvider({ children }) {
    const navigate = useNavigate()
    const handleGoBack = useCallback(() => {
        navigate(-1);
        // eslint-disable-next-line
    }, []);             //ignore navigate
    // States
    const [taskList, setTaskList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail?.role

    /*---------------------Functions Related to Tasks---------------------------*/

    const fetchTaskByProjectId = useCallback(async (projectId) => {
        const API = `${TASK_API}/project/${projectId}`;
        fetch(API, token)
            .then(res => setTaskList(res))
    }, [token])

    const fetchUserTaskById = useCallback(async (userId, taskId) => {
        const API = `${TASK_API}/user/${userId}`;
        fetch(API, token)
            .then(res => {
                setTaskList(res)    // for table
                if (taskId) {
                    const task = res.find(t => t.id === Number(taskId))
                    if (task) {
                        setSelectedTask(task) //for detail view
                        return true
                    }
                    else {
                        handleGoBack()
                    }
                }
            })
    }, [token, handleGoBack])

    const fetchTaskById = useCallback(async (taskId) => {
        const API = `${TASK_API}/${taskId}`;
        fetch(API, token)
            .then(res => { setSelectedTask(res); return true })
    }, [token])

    const removeTask = async (taskId) => {
        const API = `${TASK_API}/${taskId}`
        remove(API, token)
            .then(() => {
                const newData = taskList.filter(d => d.id !== taskId)
                setTaskList(newData);
            })
    };

    const createTask = async (newTask) => {
        create(TASK_API, token, newTask)
            .then(() => handleGoBack())
    };

    const updateTask = async (taskId, updatedTask) => {
        const API = `${TASK_API}/${taskId}`
        update(API, token, updatedTask)
            .then(() => handleGoBack())
    };

    const assignTask = async (data) => {
        const API = `${TASK_API}/assign_task`
        update(API, token, data)
            .then(() => handleGoBack())
    };

    // if role is user then update the task state with his/her tasks
    useEffect(() => {
        role === USER_ROLE_USER && fetchUserTaskById(userDetail.ID)
    }, [role, fetchUserTaskById, userDetail])

    return (
        <TaskContext.Provider value={{ fetchUserTaskById, selectedTask, taskList, createTask, removeTask, updateTask, fetchTaskByProjectId, fetchTaskById, assignTask }}>
            {children}
        </TaskContext.Provider>
    );
}