import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useLocation, useParams } from 'react-router-dom';
import Input from '../../components/Input';
import { useTaskData, useTeamData } from '../../context';

export default function AssignTask() {
    // Get Project and Task Id
    const { taskId } = useParams()
    // Get Team id from url
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const teamId = queryParams.get('team')
    // Get Data from providers
    const { teamUsers, fetchTeamUsersById } = useTeamData()
    const { assignTask } = useTaskData()
    // Form State
    const [Form, setForm] = useState({
        taskId: Number(taskId),
        userId: '',
    })
    useEffect(() => {
        fetchTeamUsersById(teamId)
    }, [fetchTeamUsersById, teamId])

    useEffect(() => {
        teamUsers.length !== 0 &&
            setForm(prevState => ({
                ...prevState,
                userId: teamUsers[0].id
            }))
    }, [teamUsers])

    const handleChange = (e) => {
        const { value } = e.target;
        const userName = teamUsers.find(u => u.userName === value)
        setForm((prevState) => ({ ...prevState, userId: userName.id }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        assignTask(Form)
    }

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7">Assign Task</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6 items-center">
                                <Input type="number" name="userId" value={Form.userId} onChange={handleChange} minLength={8} title={'User Id'} disabled />
                                <Select label={'User'} data={teamUsers.map((users) => ({ Id: users.id, value: users.userName }))} onChange={handleChange} required />
                            </div>
                            <div className="flex justify-center">
                                <div className='flex items-baseline gap-3'>
                                    <Button type="submit" label={'Assign'} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}