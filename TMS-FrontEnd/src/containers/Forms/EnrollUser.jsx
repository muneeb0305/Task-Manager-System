import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useParams } from 'react-router-dom';
import Input from '../../components/Input';
import { useTeamData, useUserData } from '../../context';

export default function EnrollUser() {
    // Get Team Id
    const { TeamId } = useParams()

    // Get Data from providers
    const { assignTeam } = useTeamData()
    const { userList } = useUserData()
    // States
    const [Form, setForm] = useState({
        userId: '',
        teamId: Number(TeamId)
    })

    useEffect(() => {
        userList.length !== 0 &&
            setForm(pre => ({
                ...pre,
                userId: userList[0].id
            }))
    }, [userList])

    const handleChange = (e) => {
        const { value } = e.target;
        const users = userList.find(users => users.userName === value)
        setForm((prevState) => ({ ...prevState, userId: Number(users.id) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        assignTeam(Form)
    }

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7">Enroll User</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6 items-center">
                                <Input type="number" name="userId" value={Form.userId} onChange={handleChange} minLength={8} title={'User Id'} disabled />
                                <Select label={'User'} data={userList && userList.map((u) => ({ Id: u.id, value: u.userName }))} name='userName' value={Form.userName} onChange={handleChange} required />
                            </div>
                            <div className="flex justify-center">
                                <div className='flex items-baseline gap-3'>
                                    <Button type="submit" label={'Enroll'} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}