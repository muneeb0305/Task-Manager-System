import React, { useEffect } from 'react'
import TableView from '../../components/TableView'
import { useTeamData } from '../../context/TeamProvider'

export default function Teams() {
    // Get Team from Team Provider
    const { team, getTeam, remove } = useTeamData()

    //Retrive all Teams
    useEffect(() => {
        getTeam()
        // eslint-disable-next-line
    }, [])
    // Data for table view
    const TableHeaders = ["Team Name", "Assigned Project", "Action"]
    const Tabledata = team
    const Heading = 'Teams'
    const ButtonName = "Team"
    const dataArr = ['teamName', 'assignedProject']
    const removeFunc = remove

    return (
        <TableView Heading={Heading} ButtonName={ButtonName} TableHeaders={TableHeaders} TableData={Tabledata}
            dataArr={dataArr} remove={removeFunc}/>
    )
}