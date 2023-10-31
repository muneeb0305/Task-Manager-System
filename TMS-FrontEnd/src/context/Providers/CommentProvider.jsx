import React, { createContext, useCallback, useState } from 'react';
import { FetchData } from '../../utils/FetchData';
import { DeleteData } from '../../utils/DeleteData';
import { PostData } from '../../utils/PostData';
import { PutData } from '../../utils/PutData';
import { useAuth } from '..';
import { host } from '../../data/AppConstants';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';

export const CommentContext = createContext();

export function CommentProvider({ children }) {
    const navigate = useNavigate()
    // States
    const [comment, setComment] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    // Get Token
    const { token } = useAuth()

    // Get All Comments by Task Id
    const getComment = useCallback(async (id) => {
        try {
            const CommentApi = `${host}/api/Comment/task/${id}`
            const res = await FetchData(CommentApi, token)
            setComment(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get Comment by ID
    const getCommentById = useCallback(async (id) => {
        try {
            const CommentApi = `${host}/api/Comment/${id}`;
            const res = await FetchData(CommentApi, token);
            setSelectedComment(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Delete Comment
    const remove = async (id) => {
        try {
            const deleteAPI = `${host}/api/Comment/${id}`
            const res = await DeleteData(deleteAPI, token)
            const newData = comment.filter(c => c.id !== id)
            setComment(newData)
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Create Comment
    const create = async (id, newComment) => {
        try {
            const CreateApi = `${host}/api/Comment/${id}`
            const res = await PostData(CreateApi, newComment, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Update Team
    const update = async (id, updatedComment) => {
        try {
            const UpdateApi = `${host}/api/Comment/${id}`
            const res = await PutData(UpdateApi, updatedComment, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    return (
        <CommentContext.Provider value={{ selectedComment, comment, create, remove, update, getComment, getCommentById }}>
            {children}
        </CommentContext.Provider>
    );
}