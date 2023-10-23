import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserData } from '../../context/UserProvider';

export default function AddUser() {
    // Get User Id 
    const { id } = useParams()
    const navigate = useNavigate()
    //Check is ID there or not
    const isID = !!id
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
            getUserById(id)
        }
        // eslint-disable-next-line
    }, [isID, id]);

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
            alert("Password not match")
        }
        else {
            isID ?
                // Update User
                update(id, Form)
                    .then(res => {
                        alert(res)
                        navigate('/user')
                    })
                    .catch(err => alert(err))
                :
                //Create User
                create(Form)
                    .then(res => {
                        alert(res)
                        navigate('/user')
                    })
                    .catch(err => alert(err))
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
                                <Input type="text" name="userName" value={Form.userName} onChange={handleChange} minLength={8} title={'User Name'} />
                                <Input type="email" name="email" value={Form.email} onChange={handleChange} title={'Email Address'} />
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="password" name="password" value={Form.password} onChange={handleChange} title={'Password'} />
                                <Input type="password" name="retype_password" value={Form.retype_password} onChange={handleChange} title={'Confirm Password'} />
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Select label={'Task Status'} data={userType} name='role' value={Form.role} onChange={handleChange} />
                            </div>
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}