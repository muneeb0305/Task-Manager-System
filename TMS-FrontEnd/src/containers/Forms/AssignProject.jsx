import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import { useProjectData, useTeamData } from '../../context';

export default function AssignProject() {
    const navigate = useNavigate()
    // Get Project Id
    const { ProjectId } = useParams()
    // Get Data from Providers
    const { assignProject } = useProjectData()
    const { team } = useTeamData()
    // Form State
    const [Form, setForm] = useState({
        projectId: Number(ProjectId),
        teamId: ``,
    })

    useEffect(() => {
        if (team.length !== 0) {
            setForm(prevState => ({
                ...prevState,
                teamId: team[0].id
            }))
        }
    }, [team])

    const handleChange = (e) => {
        const { value } = e.target;
        const teamName = team.find(t => t.teamName === value)
        setForm((prevState) => ({ ...prevState, teamId: teamName.id }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        assignProject(Form)
            .then(res => {
                Alert({ icon: 'success', title: res })
                navigate(`/project/${ProjectId}`)
            })
            .catch(err => alert(err))
    }

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7">Assign Project</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6 items-center">
                                <Input type="number" name="teamId" value={Form.teamId} onChange={handleChange} minLength={8} title={'Team Id'} disabled />
                                <Select label={'Team'} data={team.map((teams) => ({ Id: teams.id, value: teams.teamName }))} onChange={handleChange} required />
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