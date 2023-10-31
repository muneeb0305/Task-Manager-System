import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useParams } from 'react-router-dom';
import { useAuth, useCommentData } from '../../context';

export default function AddComment() {
    // get projectId, TaskId & CommentId
    const { ProjectId, taskId, id } = useParams()
    //Check is Comment ID there or not
    const isID = !!id
    // Get data from Providers
    const { selectedComment, create, update, fetchCommentById } = useCommentData()
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
        isID ? update(id, newForm) : create(taskId, newForm)
    }
    useEffect(() => {
        if (isID) {
            fetchCommentById(id)
        }
    }, [isID, id, fetchCommentById, ProjectId, taskId]);

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