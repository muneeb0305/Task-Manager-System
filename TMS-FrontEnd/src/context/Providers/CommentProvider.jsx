import React, { createContext, useCallback, useState } from 'react';
import { create, remove, update } from '../../utils';
import { useAuth } from '..';
import { API_ENDPOINTS } from '../../data/AppConstants';
import { useNavigate } from 'react-router-dom';
export const CommentContext = createContext();

const COMMENT_API = API_ENDPOINTS.COMMENT

export function CommentProvider({ children }) {
    const navigate = useNavigate()
    const handleGoBack = () => navigate(-1);
    // States
    const [commentList, setCommentList] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    // Get Token
    const { token } = useAuth()

    // Functions Related to Comment
    const fetchComment = useCallback(async (taskId) => {
        const API = `${COMMENT_API}/task/${taskId}`
        fetch(API, token)
            .then(res => setCommentList(res))
    }, [token])

    const fetchCommentById = useCallback(async (commentId) => {
        const API = `${COMMENT_API}/${commentId}`;
        fetch(API, token)
            .then(res => setSelectedComment(res))
    }, [token])

    const removeComment = async (commentId) => {
        const API = `${COMMENT_API}/${commentId}`
        remove(API, token)
            .then(() => {
                const newData = commentList.filter(c => c.id !== commentId)
                setCommentList(newData)
            })
    };

    const createComment = async (taskId, newComment) => {
        const API = `${COMMENT_API}/${taskId}`
        create(API, token, newComment)
            .then(() => handleGoBack())
    };

    const updateComment = async (commentId, updatedComment) => {
        const API = `${COMMENT_API}/${commentId}`
        update(API, token, updatedComment)
            .then(() => handleGoBack())
    };

    return (
        <CommentContext.Provider value={{ selectedComment, commentList, createComment, removeComment, updateComment, fetchComment, fetchCommentById }}>
            {children}
        </CommentContext.Provider>
    );
}