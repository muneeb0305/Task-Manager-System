import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserData } from '../../context/UserProvider';
import Alert from '../../components/Alert';

export default function AddUser() {
    // Get User Id 
    const { UserId } = useParams()
    const navigate = useNavigate()
    //Check is ID there or not
    const isID = !!UserId
    //User Provider
    const { selectedUser, create, update, getUserById } = useUserData()
    // User Types
    const userType = [
        {
            id: 'admin',
            value: 'Admin'
        },
        {
            id: 'user',
            value: 'User'
        }
    ]
    // State
    const [Form, setForm] = useState({
        userName: '',
        email: '',
        password: '',
        retype_password: '',
        role: userType[0].id,
    })

    useEffect(() => {
        if (isID) {
            getUserById(UserId)
                .catch(err => {
                    navigate('/user')
                })
        }
        // eslint-disable-next-line
    }, [isID, UserId]);

    useEffect(() => {
        // If id set form
        if (selectedUser && isID) {
            setForm(prev => ({
                ...prev,
                userName: selectedUser.userName,
                email: selectedUser.email,
                role: selectedUser.role
            }));
        }

    }, [selectedUser, isID]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (Form.password !== Form.retype_password) {
            Alert({ icon: 'error', title: "Password not match" })
        }
        else {
            isID ?
                // Update User
                update(UserId, Form)
                    .then(res => {
                        Alert({ icon: 'success', title: res })
                        navigate('/user')
                    })
                    .catch(err => Alert({ icon: 'error', title: err }))
                :
                //Create User
                create(Form)
                    .then(res => {
                        Alert({ icon: 'success', title: res })
                        navigate('/user')
                    })
                    .catch(err => Alert({ icon: 'error', title: err }))
        }
    }

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7 text-center">User {isID ? "Updation" : "Registration"}</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="text" name="userName" value={Form.userName} onChange={handleChange} maxLength={50} autoComplete="username" title={'User Name'} required />
                                <Input type="email" name="email" value={Form.email} onChange={handleChange} title={'Email Address'}autoComplete="email" required />
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="password" name="password" value={Form.password} minLength={8} onChange={handleChange} autoComplete="new-password" title={'Password'} required />
                                <Input type="password" name="retype_password" value={Form.retype_password} minLength={8} autoComplete="new-password" onChange={handleChange} title={'Confirm Password'} required />
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Select label={'User Typr'} data={userType} name='role' value={Form.role} onChange={handleChange} required />
                            </div>
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}