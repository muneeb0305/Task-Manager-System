import React from 'react'
import TableView from '../../components/TableView'
import { USER_ROLE_ADMIN } from '../../data/AppConstants'
import { useUserData, useTeamData, useProjectData, useAuth } from '../../context'

export default function View({ display }) {
    // Get Data from Provider
    const { userList, removeUser } = useUserData()
    const { projectList, removeProject } = useProjectData()
    const { teamList, removeTeam } = useTeamData()
    const { userDetail } = useAuth()

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
            editLink: userDetail.role === USER_ROLE_ADMIN ? '/team' : null,
            viewLink: '/team',
        }
    }
    // Table Configured
    const tableConfig = tableConfigs[display]

    return (
        <TableView {...tableConfig} />
    )
}