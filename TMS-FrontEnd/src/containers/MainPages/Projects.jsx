import React, { useEffect } from 'react'
import TableView from '../../components/TableView'
import { useProjectData } from '../../context/ProjectProvider'

export default function Projects() {
    // Get Projects from Project Provider
    const { project, getProject, remove } = useProjectData()

    //Retrive all projects
    useEffect(() => {
        getProject()
        // eslint-disable-next-line
    }, [])

    // Data for table view
    const TableHeaders = ["Project Name", "Assigned to", "Action"]
    const Heading = 'Projects'
    const ButtonName = "Project"
    const Tabledata = project
    const dataArr = ['projectName', 'assignedTo']
    const removeFunc = remove
    const editLink = '/project'
    const viewLink = '/project'

    return (
        <TableView Heading={Heading} ButtonName={ButtonName} TableHeaders={TableHeaders} editLink={editLink} viewLink={viewLink}
            TableData={Tabledata} dataArr={dataArr} remove={removeFunc} />
    )
}