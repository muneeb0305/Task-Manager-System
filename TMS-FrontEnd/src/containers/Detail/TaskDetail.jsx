import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Button from '../../components/Button'
import About from '../../components/About'
import { useTaskData } from '../../context/TaskProvider'
import { useCommentData } from '../../context/CommentProvider'
import Table from '../../components/Table'
import { useTeamData } from '../../context/TeamProvider'
import { useAuth } from '../../context/AuthProvider'
import Alert from '../../components/Alert'

export default function TaskDetail() {
    const navigate = useNavigate()
    // Get Project & task id
    const { ProjectId, taskId } = useParams()
    // Get Task Data From Provider
    const { selectedTask, getTaskById } = useTaskData()
    const { comment, remove, getComment } = useCommentData()
    const { teamUsers, getTeamUsersById } = useTeamData()
    const { userDetail } = useAuth()
    const role = userDetail.role
    // State
    const [Loading, setIsLoading] = useState(false)
    // Data For table
    const Headers = role === 'admin' ? ["Comment", "Created At", "Created By", "Action"] : ["Comment", "Created At", "Created By"]
    const tableData = comment
    const removeFunc = remove
    const dataArr = ['comment', 'createdAt', 'createdBy']
    const editLink = 'comment'

    useEffect(() => {
        getTaskById(taskId)
            .then(() => setIsLoading(true))
        getComment(taskId)
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (Loading && selectedTask.teamId && role === 'admin') {
            getTeamUsersById(selectedTask.teamId)
                .catch(err => console.log(err))
        }
        // eslint-disable-next-line
    }, [selectedTask, Loading])

    const aboutData = {
        "Task ID": selectedTask && selectedTask.id,
        "Task Name": selectedTask && selectedTask.taskName,
        "Task Description": selectedTask && selectedTask.description,
        "Project Name": selectedTask && selectedTask.projectName,
        "Status": selectedTask && selectedTask.status,
        "Assign To": selectedTask && selectedTask.assignedTo == null ? 'Not assigned' : selectedTask && selectedTask.assignedTo,
        "Assigned Team": selectedTask && selectedTask.assinedTeam == null ? 'Not assigned' : selectedTask && selectedTask.assinedTeam,
        "Due Date": selectedTask && selectedTask.dueDate
    }
    const handleClick = () => {
        if (selectedTask.teamId === null) {
            Alert({ icon: 'error', title: "Team is not assigned" })
        }
        else if (teamUsers.length === 0) {
            Alert({ icon: 'error', title: "User not added in Team" })
        } else {
            navigate(`/project/${ProjectId}/task/${taskId}/assign?team=${selectedTask.teamId}`)
        }
    }
    return (
        <section>
            <div className='bg-gray-100 min-h-screen pt-20'>
                <div className="container mx-auto p-5">
                    <h1 className="text-4xl font-medium py-5">Task</h1>
                    <div className="md:flex no-wrap md:-mx-2 ">
                        <div className="w-full">
                            {
                                role === 'admin' ?
                                    <div className='flex justify-end mb-3'>
                                        <Button label={'Assign Task'} onClick={handleClick} />
                                    </div>
                                    : null
                            }
                            <About data={aboutData} />
                            <div className={`bg-white border-2 rounded-lg  shadow-lg p-5 mt-5`}>
                                <div className='flex justify-between px-4'>
                                    <div className='flex items-center'>
                                        <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                                        <h2 className='text-xl pl-3'>Comments</h2>
                                    </div>
                                    <Link to="comment/create"><Button label={'Add Comment'} /></Link>
                                </div>
                                <Table tableData={tableData} tableHeader={Headers} editLink={editLink} dataArr={dataArr} remove={removeFunc} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}