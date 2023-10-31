import React, { useEffect } from 'react'
import Table from '../../components/Table'
import { Link, useParams } from 'react-router-dom'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Button from '../../components/Button'
import About from '../../components/About'
import { useAuth, useTeamData } from '../../context'
import Alert from '../../components/Alert'
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../../data/AppConstants'

export default function TeamDetail() {
    // Get Team ID
    const { TeamId } = useParams()
    //Get data from providers
    const { teamUsers, selectedTeam, getTeamById, getTeamUsersById, unassignTeam, getUserTeam } = useTeamData()
    const { userDetail } = useAuth()
    const role = userDetail.role

    //table Configuration
    const tableConfig = {
        tableHeader: role === USER_ROLE_ADMIN ? ["User Name", "Email", "Action"] : ["User Name", "Email"],
        tableData: teamUsers,
        removeFunc: unassignTeam,
        dataArr: ['userName', 'email'],
        viewLink: 'user',
    }

    // Retrive Data
    useEffect(() => {
        if (role === USER_ROLE_ADMIN) {
            getTeamById(TeamId)
                .catch((err) => Alert({ icon: 'error', title: err }))
            getTeamUsersById(TeamId)
                .catch((err) => Alert({ icon: 'error', title: err }))
        }
        else if (role === USER_ROLE_USER) {
            getUserTeam(TeamId)
                .then(res => {
                    getTeamUsersById(res.id)
                        .catch((err) => Alert({ icon: 'error', title: err }))
                })
                .catch((err) => Alert({ icon: 'error', title: err }))
        }
    }, [TeamId, getTeamById, getUserTeam, role, getTeamUsersById])

    const aboutdata = {
        "Team ID": selectedTeam && selectedTeam.id,
        "Team Name": selectedTeam && selectedTeam.teamName,
        "Assigned Project": selectedTeam && selectedTeam.assignedProject,
        "Total Users": selectedTeam && selectedTeam.users
    }
    return (
        <section className='min-h-screen pt-20'>
            <div className='bg-gray-50 min-h-screen'>
                <div className="container mx-auto p-5">
                    <h1 className="text-4xl font-medium py-5">Team</h1>
                    <div className="md:flex no-wrap md:-mx-2 ">
                        <div className="w-full">
                            <About data={aboutdata} />
                            <div className={`bg-white border-2 rounded-lg  shadow-lg p-5 mt-5`}>
                                <div className='flex justify-between px-4'>
                                    <div className='flex items-center'>
                                        <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                                        <h2 className='text-xl pl-3'>Users Working in this Team</h2>
                                    </div>
                                    {
                                        role === USER_ROLE_ADMIN && <Link to="enroll"><Button label={'Enroll User'} /></Link>
                                    }
                                </div>
                                <Table {...tableConfig} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}