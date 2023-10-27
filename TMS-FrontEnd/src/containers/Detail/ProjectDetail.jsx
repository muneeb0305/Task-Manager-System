import React, { useEffect } from 'react'
import Table from '../../components/Table'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Button from '../../components/Button'
import About from '../../components/About'
import { useProjectData } from '../../context/ProjectProvider'
import { useTaskData } from '../../context/TaskProvider'
import { useTeamData } from '../../context/TeamProvider'
import { useAuth } from '../../context/AuthProvider'
import Alert from '../../components/Alert'

export default function ProjectDetail() {
    const navigate = useNavigate()
    const USER_ROLE_ADMIN = 'admin';
    const USER_ROLE_USER = 'user';

    // Get Project id from Url
    const { ProjectId } = useParams()
    // Get data from providers
    const { selectedProject, getProjectById, getUserProjectById } = useProjectData()
    const { task, getTaskByProjectId, remove } = useTaskData()
    const { team } = useTeamData()
    const { userDetail } = useAuth()
    const role = userDetail.role

    //table Configuration
    const tableConfig = {
        tableHeader: ["Task Name", "Status", "Due Date", "Action"],
        tableData: task,
        removeFunc: remove,
        dataArr: ['taskName', 'status', 'dueDate'],
        editLink: 'task',
        viewLink: 'task',
    }

    useEffect(() => {
        if (role === USER_ROLE_USER) {
            getUserProjectById()
                .catch((err) => { Alert({ icon: 'error', title: err }) })
        } 
        else if (role === USER_ROLE_ADMIN) {
            getProjectById(ProjectId)
                .catch((err) => { Alert({ icon: 'error', title: err }) })
            getTaskByProjectId(ProjectId)
                .catch((err) => { Alert({ icon: 'error', title: err }) })
        }
        // eslint-disable-next-line
    }, [])

    const aboutData = {
        "Project ID": selectedProject && selectedProject.id,
        "Project Name": selectedProject && selectedProject.projectName,
        "Description": selectedProject && selectedProject.description,
        "Assigned Team": selectedProject && selectedProject.assignedTo,
        "Total Tasks": selectedProject && selectedProject.totalTasks,
        "Tasks Pending": selectedProject && selectedProject.taskPending,
        "Tasks In-Process": selectedProject && selectedProject.taskInProcess,
        "Tasks Completed": selectedProject && selectedProject.taskCompleted,
    }
    const handleClick = () => {
        if (team.length === 0) {
            Alert({ icon: 'error', title: 'Add Team First' })
        }
        else {
            navigate(`assign`)
        }
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