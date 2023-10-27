import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import Select from '../../components/Select';
import { useTaskData } from '../../context/TaskProvider';
import { useAuth } from '../../context/AuthProvider';
import Alert from '../../components/Alert';

export default function AddTask() {
    const navigate = useNavigate()
    const USER_ROLE_ADMIN = 'admin';
    // Get Task id
    const { taskId } = useParams()
    //Check is ID there or not
    const isID = !!taskId
    // Get Project Id
    const { ProjectId } = useParams()
    // Get Data from Provider
    const { selectedTask, create, update, getTaskById } = useTaskData()
    const { userDetail } = useAuth()
    const role = userDetail.role
    // Task Status
    const taskStatus = [
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
    ]
    // Form State
    const [Form, setForm] = useState({
        taskName: '',
        taskDescription: 'N/A',
        dueDate: '',
        status: taskStatus[0].id,
        projectId: Number(ProjectId)
    })
    const [bool, setIsBool] = useState(true)

    useEffect(() => {
        if (isID) {
            getTaskById(taskId)
                .catch(err => {
                    navigate(`/project/${ProjectId}`)
                })
        }
        if (role === USER_ROLE_ADMIN) {
            setIsBool(false)
        }
        // eslint-disable-next-line
    }, [isID]);

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
        // eslint-disable-next-line
    }, [selectedTask, isID])

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
        isID ?
            // Update Task
            update(taskId, Form)
                .then(res => {
                    Alert({ icon: 'success', title: res })
                    navigate(`/project/${ProjectId}`)
                })
                .catch(err => Alert({ icon: 'error', title: err }))
            :
            // Create Task
            create(Form)
                .then(res => {
                    Alert({ icon: 'success', title: res })
                    navigate(`/project/${ProjectId}`)
                })
                .catch(err => Alert({ icon: 'error', title: err }))
    }

    const getTodatDate = () => {
        const _date = new Date()
        const date = _date.getDate()
        const month = _date.getMonth() + 1
        const year = _date.getFullYear()
        const fullDate = `${year}-${month}-${date}`
        return fullDate
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
                                <Input type="date" name="dueDate" value={Form.dueDate} onChange={handleChange} minLength={8} title={'Due Date'} disabled={bool} min={getTodatDate()} required />
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