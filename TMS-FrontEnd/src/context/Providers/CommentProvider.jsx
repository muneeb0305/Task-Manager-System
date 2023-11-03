import React, { createContext, useCallback, useState } from 'react';
import { HandleAPI, handleError, handleSuccess } from '../../utils';
import { useAuth } from '..';
import { COMMENT_API, Methods } from '../../data/AppConstants';
import { useNavigate } from 'react-router-dom';

export const CommentContext = createContext();

export function CommentProvider({ children }) {
    const navigate = useNavigate()
    const handleGoBack = useCallback(() => {
        navigate(-1);
        // eslint-disable-next-line
    }, []);             //ignore navigate
    // States
    const [commentList, setCommentList] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    // Get Token
    const { token } = useAuth()

    // Get All Comments by Task Id
    const fetchComment = useCallback(async (taskId) => {
        try {
            const API = `${COMMENT_API}/task/${taskId}`
            const res = await HandleAPI(API, Methods.Get, token)
            setCommentList(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Get Comment by ID
    const fetchCommentById = useCallback(async (commentId) => {
        try {
            const API = `${COMMENT_API}/${commentId}`;
            const res = await HandleAPI(API, Methods.Get, token)
            setSelectedComment(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Delete Comment
    const remove = async (commentId) => {
        try {
            const API = `${COMMENT_API}/${commentId}`
            const res = await HandleAPI(API, Methods.Delete, token)
            const newData = commentList.filter(c => c.id !== commentId)
            setCommentList(newData)
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Create Comment
    const create = async (taskId, newComment) => {
        try {
            const API = `${COMMENT_API}/${taskId}`
            const res = await HandleAPI(API, Methods.Post, token, newComment)
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Update Team
    const update = async (commentId, updatedComment) => {
        try {
            const API = `${COMMENT_API}/${commentId}`
            const res = await HandleAPI(API, Methods.Put, token, updatedComment)
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    return (
        <CommentContext.Provider value={{ selectedComment, commentList, create, remove, update, fetchComment, fetchCommentById }}>
            {children}
        </CommentContext.Provider>
    );
}