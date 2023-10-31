import React, { useEffect } from 'react'
import userPNG from '../../assets/user.png'
import About from '../../components/About'
import { useParams } from 'react-router-dom'
import { useAuth, useUserData } from '../../context'
import { USER_ROLE_USER } from '../../data/AppConstants'

export default function UserDetail() {
    // Get User ID
    const { UserId } = useParams()
    // Get Data from Provider
    const { selectedUser, fetchUserById } = useUserData()
    const { userDetail } = useAuth()

    useEffect(() => {
        userDetail.role === USER_ROLE_USER ? fetchUserById(userDetail.ID) : fetchUserById(UserId)
    }, [UserId, fetchUserById, userDetail])

    const aboutData = {
        "ID": selectedUser && selectedUser.id,
        "Name": selectedUser && selectedUser.userName,
        "Email": selectedUser && selectedUser.email,
        "Role": selectedUser && selectedUser.role,
        "Assigned Team": selectedUser && selectedUser.assignedTeam
    }

    return (
        <section className='min-h-screen pt-20'>
            <div className='bg-gray-50 min-h-screen'>
                <div className="container mx-auto p-5">
                    <h1 className="text-4xl font-medium py-5">Profile</h1>
                    <div className="md:flex no-wrap md:-mx-2 ">
                        <div className="w-full md:w-3/12 md:mx-2">
                            <div className="bg-white p-3 border-t-4 border-blue-400 shadow-lg">
                                <div className="image overflow-hidden">
                                    <img className="h-auto w-full mx-auto" src={userPNG} alt="" />
                                </div>
                            </div>
                            <div className="my-4"></div>
                        </div>
                        <div className="w-full md:w-9/12 mx-2 lg:h-64">
                            <About data={aboutData} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}