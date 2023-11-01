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
    const [commentList, setCommentList] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    // Get Token
    const { token } = useAuth()

    // Get All Comments by Task Id
    const fetchComment = useCallback(async (taskId) => {
        try {
            const CommentApi = `${host}/api/Comment/task/${taskId}`
            const res = await FetchData(CommentApi, token)
            setCommentList(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get Comment by ID
    const fetchCommentById = useCallback(async (commentId) => {
        try {
            const CommentApi = `${host}/api/Comment/${commentId}`;
            const res = await FetchData(CommentApi, token);
            setSelectedComment(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Delete Comment
    const remove = async (commentId) => {
        try {
            const deleteAPI = `${host}/api/Comment/${commentId}`
            const res = await DeleteData(deleteAPI, token)
            const newData = commentList.filter(c => c.id !== commentId)
            setCommentList(newData)
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Create Comment
    const create = async (taskId, newComment) => {
        try {
            const CreateApi = `${host}/api/Comment/${taskId}`
            const res = await PostData(CreateApi, newComment, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Update Team
    const update = async (commentId, updatedComment) => {
        try {
            const UpdateApi = `${host}/api/Comment/${commentId}`
            const res = await PutData(UpdateApi, updatedComment, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    return (
        <CommentContext.Provider value={{ selectedComment, commentList, create, remove, update, fetchComment, fetchCommentById }}>
            {children}
        </CommentContext.Provider>
    );
}