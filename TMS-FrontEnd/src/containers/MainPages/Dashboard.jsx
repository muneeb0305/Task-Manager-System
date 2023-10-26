import React, { useEffect } from 'react'
import { AdminCardData, UserCardData } from '../../data/DashboardCardData'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid'
import Card from '../../components/Card'
import Table from '../../components/Table'
import { useProjectData } from '../../context/ProjectProvider'
import { useUserData } from '../../context/UserProvider'
import { useTeamData } from '../../context/TeamProvider'
import Alert from '../../components/Alert'
import { useTaskData } from '../../context/TaskProvider'

export default function Dashboard({ role }) {
    //Get Data from Providers
    const { project, getProject, remove, getUserProjectById } = useProjectData()
    const { task, getUserTask } = useTaskData()
    const { user, getUser } = useUserData()
    const { team, getTeam } = useTeamData()

    // Retrive Data
    useEffect(() => {
        if (role === 'admin') {
            getProject()
                .catch((err) => Alert({ icon: 'error', title: err }))
            getUser()
                .catch((err) => { Alert({ icon: 'error', title: err }) })
            getTeam()
                .catch((err) => { Alert({ icon: 'error', title: err }) })
        }
        else if (role === 'user') {
            getUserProjectById()
                .catch((err) => Alert({ icon: 'error', title: err }))
            getUserTask()
                .catch((err) => Alert({ icon: 'error', title: err }))
        }
        // eslint-disable-next-line
    }, []);

    // User Card Data
    let pendingCount = 0, inProcessCount = 0, completedCount = 0;

    if (role === 'user') {
        task.forEach((task) => {
            switch (task.status) {
                case 'InProcess':
                    inProcessCount++;
                    break;
                case 'Pending':
                    pendingCount++;
                    break;
                case 'Completed':
                    completedCount++;
                    break;
                default:
                    break;
            }
        });
    }

    //Configurations
    const tableConfigs = {
        admin: {

            tableHeader: ["Project Name", "Assigned to"],
            tableData: project,
            removeFunc: remove,
            dataArr: ['projectName', 'assignedTo'],
        },
        user: {
            tableHeader: ["Project Name", "Assigned to", "Action"],
            tableData: project,
            dataArr: ['projectName', 'assignedTo'],
            viewLink: 'project',
        }
    }
    const tableConfig = tableConfigs[role]
    const cardData = role === 'admin' ? AdminCardData : UserCardData

    return (
        <section>
            <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
                <div className='container mx-auto px-5 pt-5'>
                    <h1 className='text-4xl font-semibold mb-5'>Dashboard</h1>
                    {/* Dashboard Cards */}
                    <div className='grid gap-6 mb-5 md:grid-cols-3'>
                        {
                            cardData.map(({ title, icon }) => {
                                if (role === 'admin' ? title === 'Teams' : title === 'Task Pending') {
                                    return (<Card
                                        key={title}
                                        textColor={'text-blue-500'}
                                        bgColor={'bg-blue-100'}
                                        icon={icon}
                                        title={title}
                                        value={role === 'admin' ? team.length : pendingCount}
                                    />)
                                }
                                else if (role === ' admin' ? title === 'Projects' : title === 'Task In Process') {
                                    return (<Card
                                        key={title}
                                        textColor={'text-orange-500'}
                                        bgColor={'bg-orange-100'}
                                        icon={icon}
                                        title={title}
                                        value={role === 'admin' ? project.length : inProcessCount}
                                    />)
                                }
                                return (<Card
                                    key={title}
                                    textColor={'text-green-500'}
                                    bgColor={'bg-green-100'}
                                    icon={icon}
                                    title={title}
                                    value={role === 'admin' ? user.length : completedCount}
                                />)
                            })
                        }
                    </div>
                    {/* Project Table */}
                    <div className={`bg-white border-2 rounded-lg  shadow-lg p-5`}>
                        <div className='flex items-center'>
                            <ClipboardDocumentCheckIcon className={`h-7 w-7 text-blue-500 `} />
                            <h2 className='text-xl pl-3'>On Going Projects</h2>
                        </div>
                        <Table {...tableConfig} />
                    </div>
                </div>
            </div>
        </section>

    )
}