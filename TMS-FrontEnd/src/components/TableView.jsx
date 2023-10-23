import React from 'react'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import Table from './Table'
import Button from './Button'
import { Link } from 'react-router-dom'

export default function TableView({ Heading, ButtonName, TableHeaders, TableData, dataArr, remove }) {
    return (
        <section>
            <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
                <div className='container mx-auto px-5 pt-5'>
                    <h1 className='text-4xl font-semibold mb-5'>{Heading}</h1>
                    <div className={`bg-white border-2 rounded-lg  shadow-lg p-5`}>
                        <div className='flex justify-between px-4'>
                            <div className='flex items-center'>
                                <ListBulletIcon className={`h-7 w-7 text-blue-500 `} />
                                <h2 className='text-xl pl-3'>List Of {Heading}</h2>
                            </div>
                            <Link to={`create`}><Button label={`Add ${ButtonName}`} /></Link>
                        </div>
                        <Table tableData={TableData} tableHeader={TableHeaders} dataArr={dataArr} remove={remove}/>
                    </div>
                </div>
            </div>
        </section>

    )
}