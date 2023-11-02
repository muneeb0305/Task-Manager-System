import React, { createContext, useCallback, useEffect, useState } from 'react';
import { DeleteData, FetchData, PostData, PutData, handleError, handleSuccess } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { TASK_API, USER_ROLE_USER } from '../../data/AppConstants';
import { useAuth } from '..';

export const TaskContext = createContext();

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
    const role =  userDetail?.role

    // Get all tasks by project id
    const fetchTaskByProjectId = useCallback(async (projectId) => {
        try {
            const API = `${TASK_API}/project/${projectId}`;
            const res = await FetchData(API, token);
            setTaskList(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Get User tasks by UserId
    const fetchUserTaskById = useCallback(async (userId, taskId) => {
        try {
            const API = `${TASK_API}/user/${userId}`;
            const res = await FetchData(API, token);
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
        } catch (err) {
            handleError(err)
        }
    }, [token, handleGoBack])

    // Get task by Task id
    const fetchTaskById = useCallback(async (taskId) => {
        try {
            const API = `${TASK_API}/${taskId}`;
            const res = await FetchData(API, token);
            setSelectedTask(res)
            return true
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // remove task
    const remove = async (taskId) => {
        try {
            const API = `${TASK_API}/${taskId}`
            const res = await DeleteData(API, token)
            const newData = taskList.filter(d => d.id !== taskId)
            setTaskList(newData);
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Create task
    const create = async (newTask) => {
        try {
            const API = `${TASK_API}`
            const res = await PostData(API, newTask, token)
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Update task
    const update = async (taskId, updatedTask) => {
        try {
            const API = `${TASK_API}/${taskId}`
            const res = await PutData(API, updatedTask, token)
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Assign task
    const assignTask = async (data) => {
        try {
            const API = `${TASK_API}/assign_task`
            const res = await PutData(API, data, token)
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
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