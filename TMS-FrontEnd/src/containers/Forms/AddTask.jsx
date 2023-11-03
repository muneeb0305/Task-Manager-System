import React, { useEffect, useMemo, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useParams } from 'react-router-dom';
import Select from '../../components/Select';
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../../data/AppConstants';
import { useAuth, useTaskData } from '../../context';

export default function AddTask() {
    // Get Task id and Project id
    const { taskId, ProjectId } = useParams()
    //Check is ID there or not
    const isID = !!taskId
    // Get Data from Provider
    const { selectedTask, createTask, updateTask, fetchTaskById, fetchUserTaskById } = useTaskData()
    const { userDetail } = useAuth()
    const role = userDetail.role
    // Task Status
    const taskStatus = useMemo(() => [
        {
            id: 0,
            value: 'Pending'
        },
        {
            id: 1,
            value: 'InProcess'
        },
        {
            id: 2,
            value: 'Completed'
        }
    ], [])
    // States
    const [Form, setForm] = useState({
        taskName: '',
        taskDescription: 'N/A',
        dueDate: '',
        status: taskStatus[0].id,
        projectId: Number(ProjectId)
    })
    const [bool, setIsBool] = useState(true)

    useEffect(() => {
        if (isID && role === USER_ROLE_USER) {
            fetchUserTaskById(userDetail.ID, taskId)
        }
        else if (role === USER_ROLE_ADMIN) {
            setIsBool(false)
            isID && fetchTaskById(taskId)
        }
    }, [isID, ProjectId, fetchTaskById, fetchUserTaskById, role, taskId, userDetail]);

    useEffect(() => {
        if (selectedTask && isID) {
            setForm((prevState) => ({
                ...prevState,
                taskName: selectedTask.taskName,
                taskDescription: selectedTask.description,
                dueDate: selectedTask.dueDate,
                status: taskStatus.find(t => t.value === selectedTask.status).id,
            }));
        }
    }, [selectedTask, isID, taskStatus])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "status") {
            setForm((prevState) => ({ ...prevState, [name]: Number(value) }));
        } else {
            setForm((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        isID ? updateTask(taskId, Form) : createTask(Form)
    }

    const getTodayDate = () => {
        const date = new Date().toISOString().split('T')[0]
        return date
    }
    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7 text-center">Task{isID ? " Updation" : " Creation"}</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="text" name="taskName" value={Form.taskName} onChange={handleChange} maxLength={50} title={'Task Name'} disabled={bool} required />
                                <Input type="text" name="taskDescription" value={Form.taskDescription} onChange={handleChange} title={'Task Description'} disabled={bool} maxLength={200} />
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="date" name="dueDate" value={Form.dueDate} onChange={handleChange} title={'Due Date'} disabled={bool} min={getTodayDate()} required />
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Select label={'Task Status'} data={taskStatus} name='status' value={Form.status} onChange={handleChange} />
                            </div>
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}