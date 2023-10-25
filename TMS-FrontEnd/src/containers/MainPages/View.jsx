import React, { useEffect } from 'react'
import TableView from '../../components/TableView'
import { useUserData } from '../../context/UserProvider'
import { useProjectData } from '../../context/ProjectProvider'
import { useAuth } from '../../context/AuthProvider'
import { useTeamData } from '../../context/TeamProvider'
import Alert from '../../components/Alert'

export default function View({ display }) {
    // Initialize
    let TableHeaders, TableData, Heading, ButtonName, dataArr, removeFunc, editLink, viewLink
    // Get Data from Provider
    const { user, getUser, removeUser } = useUserData()
    const { project, getProject, removeProject } = useProjectData()
    const { team, getTeam, removeTeam, getUserTeam } = useTeamData()
    const { userDetail } = useAuth()

    //Retrive all Data
    useEffect(() => {
        if (display === 'user') {
            getUser()
        }
        else if (display === 'project') {
            getProject()
        }
        else if (display === 'team') {
            userDetail.role === 'admin' ?
                getTeam()
                    .catch((err) => { Alert({ icon: 'error', title: err }) }) :
                getUserTeam()
                    .catch((err) => { Alert({ icon: 'error', title: err }) })
        }
        // eslint-disable-next-line
    }, [])

    // Assign Values
    if (display === 'user') {
        TableHeaders = ["User Name", "Email", "Action"]
        TableData = user
        Heading = 'Users'
        ButtonName = "User"
        dataArr = ['userName', 'email']
        removeFunc = removeUser
        editLink = '/user'
        viewLink = '/user'
    }
    else if (display === 'project') {
        TableHeaders = ["Project Name", "Assigned to", "Action"]
        Heading = 'Projects'
        ButtonName = "Project"
        TableData = project
        dataArr = ['projectName', 'assignedTo']
        removeFunc = removeProject
        editLink = '/project'
        viewLink = '/project'
    }
    else if (display === 'team') {
        TableHeaders = ["Team Name", "Assigned Project", "Action"]
        TableData = team
        Heading = 'Teams'
        ButtonName = "Team"
        dataArr = ['teamName', 'assignedProject']
        removeFunc = removeTeam
        editLink = userDetail.role === 'admin' ? '/team' : null
        viewLink = '/team'
    }
    
    return (
        <TableView Heading={Heading} ButtonName={ButtonName} TableHeaders={TableHeaders} editLink={editLink} viewLink={viewLink}
            TableData={TableData} dataArr={dataArr} remove={removeFunc} />
    )
}