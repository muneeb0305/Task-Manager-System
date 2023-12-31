import React, { useEffect } from 'react'
import Table from '../../components/Table'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Button from '../../components/Button'
import About from '../../components/About'
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../../data/AppConstants'
import { useAuth, useProjectData, useTaskData, useTeamData } from '../../context'
import { handleError } from '../../utils'

export default function ProjectDetail() {
    const navigate = useNavigate()
    // Get Project id from Url
    const { ProjectId } = useParams()
    // Get data from providers
    const { selectedProject, fetchProjectById, fetchUserProjectById } = useProjectData()
    const { taskList, fetchTaskByProjectId, removeTask, fetchUserTaskById } = useTaskData()
    const { teamList } = useTeamData()
    const { userDetail } = useAuth()
    const { role } = userDetail

    //table Configuration
    const tableConfig = {
        tableHeader: ["Task Name", "Status", "Due Date", "Action"],
        tableData: taskList,
        removeFunc: removeTask,
        dataArr: ['taskName', 'status', 'dueDate'],
        editLink: 'task',
        viewLink: 'task',
    }

    useEffect(() => {
        if (role === USER_ROLE_USER) {
            fetchUserProjectById(userDetail.ID, ProjectId)
            fetchUserTaskById(userDetail.ID)
        }
        else if (role === USER_ROLE_ADMIN) {
            fetchProjectById(ProjectId)
            fetchTaskByProjectId(ProjectId)
        }
    }, [ProjectId, fetchProjectById, fetchTaskByProjectId, fetchUserProjectById, fetchUserTaskById, role, userDetail])

    const aboutData = {
        "Project ID": selectedProject?.id,
        "Project Name": selectedProject?.projectName,
        "Description": selectedProject?.description,
        "Assigned Team": selectedProject?.assignedTo,
        "Total Tasks": selectedProject?.totalTasks,
        "Tasks Pending": selectedProject?.taskPending,
        "Tasks In-Process": selectedProject?.taskInProcess,
        "Tasks Completed": selectedProject?.taskCompleted,
    }
    const handleClick = () => {
        teamList.length === 0 ? handleError('Add Team First') : navigate(`assign`)
    }
    return (
        <section className='bg-gray-100 min-h-screen pt-20'>
            <div className="container mx-auto p-5">
                <h1 className="text-4xl font-medium py-5">Project</h1>
                <div className="md:flex no-wrap md:-mx-2 ">
                    <div className="w-full">
                        {
                            role === USER_ROLE_ADMIN &&
                            <div className='flex justify-end mb-3'>
                                <Button label={'Assign project'} onClick={handleClick} />
                            </div>
                        }
                        <About data={aboutData} />
                        <div className={`bg-white border-2 rounded-lg  shadow-lg p-5 mt-5`}>
                            <div className='flex justify-between px-4'>
                                <div className='flex items-center'>
                                    <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                                    <h2 className='text-xl pl-3'>{role === USER_ROLE_ADMIN ? '' : 'Your'} Tasks</h2>
                                </div>
                                {
                                    role === USER_ROLE_ADMIN &&
                                    <Link to="task/create"><Button label={'Add Task'} /></Link>
                                }
                            </div>
                            <Table {...tableConfig} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}