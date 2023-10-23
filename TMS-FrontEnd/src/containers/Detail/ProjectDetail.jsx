import React, { useEffect } from 'react'
import Table from '../../components/Table'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Button from '../../components/Button'
import About from '../../components/About'
import { useProjectData } from '../../context/ProjectProvider'
import { useTaskData } from '../../context/TaskProvider'
import { useTeamData } from '../../context/TeamProvider'

export default function ProjectDetail() {
    const navigate = useNavigate()
    // Get Project id from Url
    const { id } = useParams()
    // Get data from providers
    const { selectedProject, getProjectById } = useProjectData()
    const { task, getTaskByProjectId, remove } = useTaskData()
    const { team, getTeam } = useTeamData()
    //  Data for table 
    const Headers = ["Task Name", "Status", "Due Date", "Action"]
    const tableData = task
    const dataArr = ['taskName', 'status', 'dueDate']
    const removeFunc = remove

    useEffect(() => {
        getProjectById(id)
        getTaskByProjectId(id)
        getTeam()
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
            alert("First Add Team")
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
                        <div className='flex justify-end mb-3'>
                            <Button label={'Assign project'} onClick={handleClick} />
                        </div>
                        <About data={aboutData} />
                        <div className={`bg-white border-2 rounded-lg  shadow-lg p-5 mt-5`}>
                            <div className='flex justify-between px-4'>
                                <div className='flex items-center'>
                                    <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                                    <h2 className='text-xl pl-3'>Tasks</h2>
                                </div>
                                <Link to="task/create"><Button label={'Add Task'} /></Link>
                            </div>
                            <Table tableData={tableData} tableHeader={Headers} name="task" dataArr={dataArr} remove={removeFunc} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}