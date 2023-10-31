import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Button from '../../components/Button'
import About from '../../components/About'
import Table from '../../components/Table'
import Alert from '../../components/Alert'
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../../data/AppConstants'
import { useAuth, useCommentData, useTaskData, useTeamData } from '../../context'

export default function TaskDetail() {
    const navigate = useNavigate();
    // Get Project & task id
    const { ProjectId, taskId } = useParams()
    // Get Task Data From Provider
    const { selectedTask, getTaskById, getUserTaskById } = useTaskData()
    const { comment, remove, getComment } = useCommentData()
    const { teamUsers, getTeamUsersById } = useTeamData()
    const { userDetail } = useAuth()
    const role = userDetail.role
    // State
    const [Loading, setIsLoading] = useState(false)

    //table Configuration
    const tableConfig = {
        tableHeader: role === USER_ROLE_ADMIN ? ["Comment", "Created At", "Created By", "Action"] : ["Comment", "Created At", "Created By"],
        tableData: comment,
        removeFunc: remove,
        dataArr: ['comment', 'createdAt', 'createdBy'],
        editLink: 'comment',
    }

    useEffect(() => {
        role === USER_ROLE_ADMIN &&
            getTaskById(taskId)
                .then(() => setIsLoading(true))
                .catch((err) => { Alert({ icon: 'error', title: err }) })
        role === USER_ROLE_USER &&
            getUserTaskById(taskId)
                .then(() => setIsLoading(true))
                .catch((err) => { Alert({ icon: 'error', title: err }) })
        getComment(taskId)
            .catch((err) => { Alert({ icon: 'error', title: err }) })
    }, [getComment, getTaskById, getUserTaskById, role, taskId])

    useEffect(() => {
        if (Loading && selectedTask.teamId && role === USER_ROLE_ADMIN) {
            getTeamUsersById(selectedTask.teamId)
                .catch(err => console.log(err))
        }
    }, [selectedTask, Loading, getTeamUsersById, role])

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
                                role === USER_ROLE_ADMIN &&
                                <div className='flex justify-end mb-3'>
                                    <Button label={'Assign Task'} onClick={handleClick} />
                                </div>
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
                                <Table {...tableConfig} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}