import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useParams } from 'react-router-dom';
import { useTeamData } from '../../context';

export default function AddTeam() {
    // Get Team ID
    const { TeamId } = useParams()
    //Check is ID there or not
    const isID = !!TeamId
    // Get Data from Team Provider
    const { selectedTeam, createTeam, updateTeam, fetchTeamById } = useTeamData()
    // Form State
    const [Form, setForm] = useState({ teamName: '' })

    useEffect(() => {
        isID && fetchTeamById(TeamId)
    }, [TeamId, fetchTeamById, isID]);

    useEffect(() => {
        // Set Form
        (selectedTeam && isID) &&
            setForm((prevState) => ({
                ...prevState,
                teamName: selectedTeam.teamName
            }));

    }, [selectedTeam, isID])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        isID ? updateTeam(TeamId, Form) : createTeam(Form)
    }

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7 text-center">Team {isID ? "Updation" : "Creation"}</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg '>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <Input type="text" name="teamName" value={Form.teamName} onChange={handleChange} maxLength={50} title={'Team Name'} required />
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}