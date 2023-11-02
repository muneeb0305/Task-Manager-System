import React from 'react'
import { USER_ROLE_ADMIN } from '../../data/AppConstants'
import { useUserData, useTeamData, useProjectData, useAuth } from '../../context'
import Button from '../../components/Button'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import Table from '../../components/Table'

export default function View({ display }) {
    // Get Data from Provider
    const { userList, removeUser } = useUserData()
    const { projectList, removeProject } = useProjectData()
    const { teamList, removeTeam } = useTeamData()
    const { userDetail } = useAuth()
    const { role } = userDetail

    // Table Configurations of User, Team, Project and Task
    const tableConfigs = {
        user: {
            tableHeader: ["User Name", "Email", "Action"],
            tableData: userList,
            Heading: 'Users',
            ButtonName: "User",
            dataArr: ['userName', 'email'],
            removeFunc: removeUser,
            editLink: '/user',
            viewLink: '/user',
        },
        project: {
            tableHeader: ["Project Name", "Assigned to", "Action"],
            Heading: 'Projects',
            ButtonName: "Project",
            tableData: projectList,
            dataArr: ['projectName', 'assignedTo'],
            removeFunc: removeProject,
            editLink: '/project',
            viewLink: '/project'
        },
        team: {
            tableHeader: ["Team Name", "Assigned Project", "Action"],
            tableData: teamList,
            Heading: 'Teams',
            ButtonName: "Team",
            dataArr: ['teamName', 'assignedProject'],
            removeFunc: removeTeam,
            editLink: role === USER_ROLE_ADMIN ? '/team' : null,
            viewLink: '/team',
        }
    }
    // Configurations
    const config = tableConfigs[display]

    return (
        <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
            <div className='container mx-auto px-5 pt-5'>
                <div className={`bg-white border-2 rounded-lg  shadow-lg p-4`}>
                    <div className='flex justify-between px-4'>
                        <div className='flex items-center'>
                            <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                            <h2 className='text-2xl font-semibold pl-3'>{config.Heading}</h2>
                        </div>
                        {
                            role === USER_ROLE_ADMIN && <Link to={`create`}><Button label={`Add ${config.ButtonName}`} /></Link>
                        }
                    </div>
                    <Table {...config} />
                </div>
            </div>
        </div>
    )
}