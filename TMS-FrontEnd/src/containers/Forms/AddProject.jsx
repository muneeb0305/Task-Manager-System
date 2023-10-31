import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import { useProjectData } from '../../context';

export default function AddProject() {
    const navigate = useNavigate()
    // Get Project Id
    const { ProjectId } = useParams()
    //Check is ID there or not
    const isID = !!ProjectId
    // Get Data from Providers
    const { selectedProject, create, update, getProjectById } = useProjectData()
    // Form State
    const [Form, setForm] = useState({
        name: '',
        description: 'N/A'
    })

    useEffect(() => {
        if (isID) {
            getProjectById(ProjectId)
                .catch(err => {
                    navigate('/project')
                })
        }
        // eslint-disable-next-line
    }, [ProjectId, isID])

    useEffect(() => {
        if (selectedProject && isID) {
            setForm((prevState) => ({
                ...prevState,
                name: selectedProject.projectName,
                description: selectedProject.description
            }));
        }
    }, [selectedProject, isID])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        isID ?
            // Update Project
            update(ProjectId, Form)
                .then(res => {
                    Alert({ icon: 'success', title: res })
                    navigate('/project')
                })
                .catch((err) => Alert({ icon: 'error', title: err }))
            :
            // Create Project
            create(Form)
                .then(res => {
                    Alert({ icon: 'success', title: res })
                    navigate('/project')
                })
                .catch((err) => Alert({ icon: 'error', title: err }))
    }

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7 text-center">Project{isID ? " Updation" : " Creation"}</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="text" name="name" value={Form.name} onChange={handleChange} maxLength={50} title={'Project Name'} required />
                                <Input type="text" name="description" value={Form.description} maxLength={200} onChange={handleChange} title={'Description'} />
                            </div>
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}