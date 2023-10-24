import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/Input';
import { useUserData } from '../../context/UserProvider';
import { useTeamData } from '../../context/TeamProvider';

export default function EnrollUser() {
    // Get Team Id
    const { TeamId } = useParams()
    const navigate = useNavigate()

    // Get Data from providers
    const { assignTeam } = useTeamData()
    const { user, getUser } = useUserData()
    // States
    const [Form, setForm] = useState({
        userId: '',
        teamId: Number(TeamId)
    })

    useEffect(() => {
        getUser()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (user.length !== 0) {
            setForm(pre => ({
                ...pre,
                userId: user[0].id
            }))
        }
        // eslint-disable-next-line
    }, [user])

    const handleChange = (e) => {
        const { value } = e.target;
        const users = user.find(users => users.userName === value)
        setForm((prevState) => ({ ...prevState, userId: Number(users.id) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        assignTeam(Form)
            .then((res) => {
                alert(res)
                navigate(`/team/${TeamId}`)
            })
            .catch(err => alert(err))
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
                                <Select label={'User'} data={user && user.map((u) => ({ Id: u.id, value: u.userName }))} name='userName' value={Form.userName} onChange={handleChange} required />
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