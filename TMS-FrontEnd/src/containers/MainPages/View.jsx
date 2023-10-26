import React, { useEffect } from 'react'
import TableView from '../../components/TableView'
import { useUserData } from '../../context/UserProvider'
import { useProjectData } from '../../context/ProjectProvider'
import { useAuth } from '../../context/AuthProvider'
import { useTeamData } from '../../context/TeamProvider'

export default function View({ display }) {
    // Get Data from Provider
    const { user, removeUser } = useUserData()
    const { project, removeProject } = useProjectData()
    const { team, removeTeam } = useTeamData()
    const { userDetail } = useAuth()

    // Table Configurations of User, Team, Project and Task
    const tableConfigs = {
        user: {
            tableHeader: ["User Name", "Email", "Action"],
            tableData: user,
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
            tableData: project,
            dataArr: ['projectName', 'assignedTo'],
            removeFunc: removeProject,
            editLink: '/project',
            viewLink: '/project'
        },
        task: {
            tableHeader: ["Team Name", "Assigned Project", "Action"],
            tableData: team,
            Heading: 'Teams',
            ButtonName: "Team",
            dataArr: ['teamName', 'assignedProject'],
            removeFunc: removeTeam,
            editLink: userDetail.role === 'admin' ? '/team' : null,
            viewLink: '/team',
        },
        team: {
            tableHeader: ["Team Name", "Assigned Project", "Action"],
            tableData: team,
            Heading: 'Teams',
            ButtonName: "Team",
            dataArr: ['teamName', 'assignedProject'],
            removeFunc: removeTeam,
            editLink: userDetail.role === 'admin' ? '/team' : null,
            viewLink: '/team',
        }
    }
    // Table Configured
    const tableConfig = tableConfigs[display]

    return (
        <TableView {...tableConfig} />
    )
}