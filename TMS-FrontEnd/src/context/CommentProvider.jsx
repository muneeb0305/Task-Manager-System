import React, { createContext, useContext, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import { useAuth } from './AuthProvider';

const CommentContext = createContext();

export function CommentProvider({ children }) {
    // States
    const [comment, setComment] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    // Get Token
    const { token } = useAuth()

    // Get All Comments by Task Id
    const getComment = async (id) => {
        const CommentApi = `https://localhost:7174/api/Comment/task/${id}`
        const res = await FetchData(CommentApi, token)
        setComment(res)
    }
    // Get Comment by ID
    const getCommentById = async (id) => {
        const CommentApi = `https://localhost:7174/api/Comment/${id}`;
        const res = await FetchData(CommentApi, token);
        setSelectedComment(res)
    }
    // Delete Comment
    const remove = async (id) => {
        const deleteAPI = `https://localhost:7174/api/Comment/${id}`
        const res = await DeleteData(deleteAPI, token)
        const newData = comment.filter(c => c.id !== id)
        setComment(newData)
        return res
    };
    // Create Comment
    const create = async (id, newComment) => {
        const CreateApi = `https://localhost:7174/api/Comment/${id}`
        const res = await PostData(CreateApi, newComment, token)
        return res
    };
    // Update Team
    const update = async (id, updatedComment) => {
        const UpdateApi = `https://localhost:7174/api/Comment/${id}`
        const res = await PutData(UpdateApi, updatedComment, token)
        return res
    };

    return (
        <CommentContext.Provider value={{ selectedComment, comment, create, remove, update, getComment, getCommentById }}>
            {children}
        </CommentContext.Provider>
    );
}

export function useCommentData() {
    return useContext(CommentContext);
}
