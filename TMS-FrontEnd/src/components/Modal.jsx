import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Alert from './Alert';

export default function Modal({ ID, editLink, viewLink, remove }) {

    const { userDetail } = useAuth()
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleDelete = () => {
        remove(ID)
            .then((res) => Alert({ icon: 'success', title: res }))
        closeModal()
    }

    return (
        <>
            {
                editLink && viewLink ?
                    <>
                        <Link to={`${editLink}/${ID}/edit`}><span className='mx-3 text-blue-500'><i className="fa-solid fa-pen-to-square"></i></span></Link>
                        <Link to={`${viewLink}/${ID}`}><span className='mx-3 text-green-500'><i className="fa-solid fa-eye"></i></span></Link>
                        {
                            userDetail.role === 'admin' ?
                                <span className='ml-2 text-red-500 cursor-pointer' onClick={openModal}><i className="fa-solid fa-trash"></i></span>
                                : null
                        }
                    </> :
                    editLink ?
                        <>
                            <Link to={`${editLink}/${ID}/edit`}><span className='mx-3 text-blue-500'><i className="fa-solid fa-pen-to-square"></i></span></Link>
                            {
                                userDetail.role === 'admin' ?
                                    <span className='ml-2 text-red-500 cursor-pointer' onClick={openModal}><i className="fa-solid fa-trash"></i></span>
                                    : null
                            }
                        </>
                        :
                        viewLink ?
                            <>
                                <Link to={`${viewLink}/${ID}`}><span className='mx-3 text-green-500'><i className="fa-solid fa-eye"></i></span></Link>
                                {
                                    userDetail.role === 'admin' ?
                                        <span className='ml-2 text-red-500 cursor-pointer' onClick={openModal}><i className="fa-solid fa-trash"></i></span>
                                        : null
                                }
                            </>
                            : null
            }
            {
                isOpen &&
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="relative flex items-center justify-center min-h-screen w-full">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative bg-white rounded-lg p-4">
                            <div className="p-6 text-center">
                                <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete?</h3>
                                <button data-modal-hide="popup-modal" onClick={() => handleDelete(ID)} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    Yes, I'm sure
                                </button>
                                <button data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={closeModal}>No, cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}