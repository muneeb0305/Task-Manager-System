import React from 'react'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Table from './Table'
import Button from './Button'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default function TableView(props) {
    const USER_ROLE_ADMIN = 'admin';
    // get User Detail from Provider
    const { userDetail } = useAuth()
    const role = userDetail.role

    return (
        <section>
            <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
                <div className='container mx-auto px-5 pt-5'>
                    <div className={`bg-white border-2 rounded-lg  shadow-lg p-4`}>
                        <div className='flex justify-between px-4'>
                            <div className='flex items-center'>
                                <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                                <h2 className='text-2xl font-semibold pl-3'>{props.Heading}</h2>
                            </div>
                            {
                                role === USER_ROLE_ADMIN && <Link to={`create`}><Button label={`Add ${props.ButtonName}`} /></Link>
                            }
                        </div>
                        <Table {...props} />
                    </div>
                </div>
            </div>
        </section>

    )
}