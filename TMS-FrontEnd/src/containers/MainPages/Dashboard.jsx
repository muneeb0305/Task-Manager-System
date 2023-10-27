import React from 'react'
import { AdminCardData, UserCardData } from '../../data/DashboardCardData'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid'
import Card from '../../components/Card'
import Table from '../../components/Table'
import { useProjectData } from '../../context/ProjectProvider'
import { useUserData } from '../../context/UserProvider'
import { useTeamData } from '../../context/TeamProvider'
import { useTaskData } from '../../context/TaskProvider'
import { useAuth } from '../../context/AuthProvider'

export default function Dashboard() {
    const USER_ROLE_ADMIN = 'admin';
    const USER_ROLE_USER = 'user';

    //Get Data from Providers
    const { project, remove } = useProjectData()
    const { task } = useTaskData()
    const { user } = useUserData()
    const { team } = useTeamData()
    const { userDetail } = useAuth()
    const role = userDetail.role

    // User Card Data
    const statusCounts = {
        InProcess: 0,
        Pending: 0,
        Completed: 0,
    };
    if (role === USER_ROLE_USER) {
        task.forEach((taskItem) => {
            statusCounts[taskItem.status]++;
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

    // Card Configuration
    const cardData = role === USER_ROLE_ADMIN ? AdminCardData : UserCardData
    const cardConfigs = {
        admin: {
            'Projects': project.length,
            'Teams': team.length,
            'Users': user.length,
        },
        user: {
            'Task Pending': statusCounts.Pending,
            'Task In Process': statusCounts.InProcess,
            'Task Completed': statusCounts.Completed,
        }
    }
    const cardConfig = cardConfigs[role]
    const keys = Object.keys(cardConfig)
    const values = Object.values(cardConfig)

    return (
        <section>
            <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
                <div className='container mx-auto px-5 pt-5'>
                    <h1 className='text-4xl font-semibold mb-5'>Dashboard</h1>
                    {/* Dashboard Cards */}
                    <div className='grid gap-6 mb-5 md:grid-cols-3'>
                        {
                            cardData.map(({ title, icon, textColor, bgColor }) => {
                                const keyIndex = keys.indexOf(title);
                                if (keyIndex !== -1) {
                                    return (<Card
                                        key={title}
                                        textColor={textColor}
                                        bgColor={bgColor}
                                        icon={icon}
                                        title={title}
                                        value={values[keyIndex]}
                                    />)
                                }
                                return null
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