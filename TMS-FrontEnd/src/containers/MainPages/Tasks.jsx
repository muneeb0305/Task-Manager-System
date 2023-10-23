
import React from 'react'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid'
import Table from '../../components/Table'
import Button from '../../components/Button'

export default function Tasks() {

    const Headers = ["Project Name", "Assigned to", "Total tasks", "Task Pending", "Task In-Process", "Task Completed", "Action"]
    const data = [{
        "projectId": 1,
        "projectName": "ERP System",
        "description": "string",
        "assignedTo": "Team 1",
        "totalTasks": 3,
        "taskPending": 3,
        "taskInProcess": 0,
        "taskCompleted": 0
    }]

    return (
        <section>
            <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
                <div className='container mx-auto px-5 pt-5'>
                    <h1 className='text-4xl font-semibold mb-5'>Projects</h1>
                    <div className={`bg-white border-2 rounded-lg  shadow-lg p-5`}>
                        <div className='flex justify-between px-4'>
                            <div className='flex items-center'>
                                <ClipboardDocumentCheckIcon className={`h-7 w-7 text-blue-500 `} />
                                <h2 className='text-xl pl-3'>List Of Tasks</h2>
                            </div>
                            <Button label={'Add Project'} />
                        </div>
                        <Table tableData={data} tableHeader={Headers} name="project" dataArr={['projectName', 'assignedTo', 'totalTasks', 'taskPending', 'taskInProcess', 'taskCompleted']} />
                    </div>
                </div>
            </div>
        </section>

    )
}