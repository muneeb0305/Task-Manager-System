import React, { useEffect } from 'react'
import TableView from '../../components/TableView'
import { useUserData } from '../../context/UserProvider'

export default function Users() {
    // Get Users from User Provider
    const { user, getUser, remove } = useUserData()

    //Retrive all Users
    useEffect(() => {
        getUser()
        // eslint-disable-next-line
    }, [])

    // Data for table view
    const TableHeaders = ["User Name", "Email", "Action"]
    const TableData = user
    const Heading = 'Users'
    const ButtonName = "User"
    const dataArr = ['userName', 'email']
    const removeFunc = remove
    const editLink = '/user'
    const viewLink = '/user'

    return (
        <TableView Heading={Heading} ButtonName={ButtonName} TableHeaders={TableHeaders} editLink={editLink} viewLink={viewLink}
            TableData={TableData} dataArr={dataArr} remove={removeFunc} />
    )
}