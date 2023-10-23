import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Button from '../../components/Button'
import About from '../../components/About'
import { useTaskData } from '../../context/TaskProvider'
import { useCommentData } from '../../context/CommentProvider'
import Table from '../../components/Table'
import { useTeamData } from '../../context/TeamProvider'

export default function TaskDetail() {
    const navigate = useNavigate()
    // Get Project & task id
    const { Pid, id } = useParams()
    // Get Task Data From Provider
    const { selectedTask, getTaskById } = useTaskData()
    const { comment, remove, getComment } = useCommentData()
    const { teamUsers, getTeamUsersById } = useTeamData()
    // Data For table
    const Headers = ["Comment", "Created At", "Created By", "Action"]
    const tableData = comment
    const removeFunc = remove
    const dataArr = ['comment', 'createdAt', 'createdBy']

    useEffect(() => {
        getTaskById(id)
        getComment(id)
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (selectedTask && selectedTask.teamId) {
            getTeamUsersById(selectedTask.teamId)
        }
        // eslint-disable-next-line
    }, [selectedTask])

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
            alert("Team is not assigned")
        }
        else if (teamUsers.length === 0) {
            alert("User not added in Team")
        } else {
            navigate(`/project/${Pid}/task/${id}/assign?team=${selectedTask.teamId}`)
        }
    }
    return (
        <section className='min-h-screen pt-20'>
            <div className='bg-gray-50 min-h-screen'>
                <div className="container mx-auto p-5">
                    <h1 className="text-4xl font-medium py-5">Task</h1>
                    <div className="md:flex no-wrap md:-mx-2 ">
                        <div className="w-full">
                            <div className='flex justify-end mb-3'>
                                <Button label={'Assign Task'} onClick={handleClick} />
                            </div>
                            <About data={aboutData} />
                            <div className={`bg-white border-2 rounded-lg  shadow-lg p-5 mt-5`}>
                                <div className='flex justify-between px-4'>
                                    <div className='flex items-center'>
                                        <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                                        <h2 className='text-xl pl-3'>Comments</h2>
                                    </div>
                                    <Link to="comment/create"><Button label={'Add Comment'} /></Link>
                                </div>
                                <Table tableData={tableData} tableHeader={Headers} name="comment" dataArr={dataArr} remove={removeFunc} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}