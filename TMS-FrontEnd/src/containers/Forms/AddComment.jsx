import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, useCommentData } from '../../context';
import Alert from '../../components/Alert';

export default function AddComment() {
    const navigate = useNavigate()
    // get projectId, TaskId & CommentId
    const { ProjectId, taskId, id } = useParams()
    //Check is Comment ID there or not
    const isID = !!id
    // Get data from Providers
    const { selectedComment, create, update, getCommentById } = useCommentData()
    const { userDetail } = useAuth()
    // Form State
    const [Form, setForm] = useState({
        commentText: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const newForm = { ...Form, userId: Number(userDetail.ID) }
        isID ?
            // Update Comment
            update(id, newForm)
                .then(res => {
                    Alert({ icon: 'success', title: res })
                    navigate(`/project/${ProjectId}/task/${taskId}`)
                })
                .catch(err => Alert({ icon: 'error', title: err }))
            :
            // Create Comment
            create(taskId, newForm)
                .then(res => {
                    Alert({ icon: 'success', title: res })
                    navigate(`/project/${ProjectId}/task/${taskId}`)
                })
                .catch(err => Alert({ icon: 'error', title: err }))
    }
    useEffect(() => {
        if (isID) {
            getCommentById(id)
                .catch(err => {
                    navigate(`/project/${ProjectId}/task/${taskId}`)
                })
        }
        // eslint-disable-next-line
    }, [isID, id]);

    useEffect(() => {
        // Set Form
        if (isID && selectedComment) {
            setForm((prevState) => ({
                ...prevState,
                commentText: selectedComment.comment,
            }));
        }
    }, [selectedComment, isID])

    return (
        <section>
            <div className="bg-gray-50 min-h-screen pt-20">
                <div className="container w-9/12 mx-auto px-5">
                    <h1 className="text-4xl font-medium py-7 text-center">Comment{isID ? " Updation" : " Creation"}</h1>
                    <div className='bg-white p-5 shadow-lg rounded-lg'>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <Input type="text" name="commentText" value={Form.commentText} onChange={handleChange} title={'Comment'} required />
                            </div>
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}