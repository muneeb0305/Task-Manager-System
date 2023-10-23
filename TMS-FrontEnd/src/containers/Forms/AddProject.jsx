import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectData } from '../../context/ProjectProvider';

export default function AddProject() {
    const navigate = useNavigate()
    // Get Project Id
    const { id } = useParams()
    //Check is ID there or not
    const isID = !!id
    // Get Data from Providers
    const { selectedProject, create, update, getProjectById } = useProjectData()
    // Form State
    const [Form, setForm] = useState({
        name: '',
        description: ''
    })

    useEffect(() => {
        if (isID) {
            getProjectById(id)
        }
        // eslint-disable-next-line
    }, [id, isID])

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
            update(id, Form)
                .then(res => {
                    alert(res)
                    navigate('/project')
                })
                .catch(err => alert(err))
            :
            // Create Project
            create(Form)
                .then(res => {
                    alert(res)
                    navigate('/project')
                })
                .catch(err => alert(err))
    }

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7 text-center">Project{isID ? " Updation" : " Creation"}</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="text" name="name" value={Form.name} onChange={handleChange} minLength={8} title={'Project Name'} />
                                <Input type="text" name="description" value={Form.description} onChange={handleChange} title={'Description'} />
                            </div>
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}