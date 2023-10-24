import React, { useEffect } from 'react'
import TableView from '../../components/TableView'
import { useTeamData } from '../../context/TeamProvider'
import { useAuth } from '../../context/AuthProvider'

export default function Teams() {
    // Get Team from Team Provider
    const { team, getTeam, remove, getUserTeam } = useTeamData()
    const {userDetail} = useAuth()

    const role =  userDetail.role

    //Retrive all Teams
    useEffect(() => {
        role==='admin'?
        getTeam(): getUserTeam()
        // eslint-disable-next-line
    }, [])

    // Data for table view
    const TableHeaders = ["Team Name", "Assigned Project", "Action"]
    const Tabledata = team
    const Heading = 'Teams'
    const ButtonName = "Team"
    const dataArr = ['teamName', 'assignedProject']
    const removeFunc = remove
    const editLink = 'team'
    const viewLink = 'team'

    return (
        <TableView Heading={Heading} ButtonName={ButtonName} editLink={editLink} viewLink={viewLink} TableHeaders={TableHeaders} TableData={Tabledata}
            dataArr={dataArr} remove={removeFunc}/>
    )
}