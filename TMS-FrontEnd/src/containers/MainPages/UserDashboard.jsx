import React, { useEffect } from 'react'
import { UserCardData } from '../../data/DashboardCardData'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid'
import Card from '../../components/Card'
import Table from '../../components/Table'
import { useProjectData } from '../../context/ProjectProvider'
import { useTaskData } from '../../context/TaskProvider'
import Alert from '../../components/Alert'

export default function UserDashboard() {
    //Get Data from Providers
    const { project, getUserProjectById } = useProjectData()
    const { task, getUserTask } = useTaskData()
    
    // Retrive Data
    useEffect(() => {
        getUserProjectById()
        getUserTask()
            .catch((err) => { Alert({ icon: 'error', title: err }) })
        // eslint-disable-next-line
    }, []);

    // Card Data for pending, inprocess, and completed
    let pendingCount = 0;
    let inProcessCount = 0;
    let completedCount = 0;

    task.forEach(task => {
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

    //table Configuration
    const tableConfig = {
        tableHeader: ["Project Name", "Assigned to", "Action"],
        tableData: project,
        dataArr: ['projectName', 'assignedTo'],
        viewLink: 'project',
    }

    return (
        <section>
            <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
                <div className='container mx-auto px-5 pt-5'>
                    <h1 className='text-4xl font-semibold mb-5'>Dashboard</h1>
                    {/* Dashboard Cards */}
                    <div className='grid gap-6 mb-5 md:grid-cols-3'>
                        {
                            UserCardData.map(({ title, icon }) => {
                                if (title === 'Task Pending') {
                                    return (<Card
                                        key={title}
                                        textColor={'text-blue-500'}
                                        bgColor={'bg-blue-100'}
                                        icon={icon}
                                        title={title}
                                        value={pendingCount}
                                    />)
                                }
                                else if (title === 'Task In Process') {
                                    return (<Card
                                        key={title}
                                        textColor={'text-orange-500'}
                                        bgColor={'bg-orange-100'}
                                        icon={icon}
                                        title={title}
                                        value={inProcessCount}
                                    />)
                                }
                                return (<Card
                                    key={title}
                                    textColor={'text-green-500'}
                                    bgColor={'bg-green-100'}
                                    icon={icon}
                                    title={title}
                                    value={completedCount}
                                />)
                            })
                        }
                    </div>
                    {/* Project Table */}
                    <div className={`bg-white border-2 rounded-lg  shadow-lg p-5`}>
                        <div className='flex items-center'>
                            <ClipboardDocumentCheckIcon className={`h-7 w-7 text-blue-500 `} />
                            <h2 className='text-xl pl-3'>On Going Project</h2>
                        </div>
                        <Table {...tableConfig} />
                    </div>
                </div>
            </div>
        </section>

    )
}