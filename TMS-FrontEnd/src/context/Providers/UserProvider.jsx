import React, { createContext, useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, USER_ROLE_ADMIN } from '../../data/AppConstants';
import { useAuth } from '..';
import { useNavigate } from 'react-router-dom';
import { fetch, remove, create, update } from '../../utils';
export const UserContext = createContext();

const USER_API = API_ENDPOINTS.USER

export function UserProvider({ children }) {
    const navigate = useNavigate()
    // Get Token & userDetail from Auth
    const { token, userDetail } = useAuth()
    const role = userDetail?.role
    // User States
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    // Navigate back to the previous route
    const handleGoBack = () => navigate(-1);

    // Functions Related to User
    const fetchUsers = useCallback(async () => {
        fetch(USER_API, token)
            .then(res => setUserList(res))
    }, [token])

    const fetchUserById = useCallback(async (userId) => {
        const API = `${USER_API}/${userId}`;
        fetch(API, token)
            .then(res => setSelectedUser(res))
    }, [token])

    const removeUser = async (userId) => {
        const API = `${USER_API}/${userId}`
        remove(API, token)
            .then(() => fetchUsers())
    };

    const createUser = async (newUser) => {
        create(USER_API, token, newUser)
            .then(() => fetchUsers(), handleGoBack())
    };

    const updateUser = async (userId, updatedUser) => {
        const API = `${USER_API}/${userId}`
        update(API, token, updatedUser)
            .then(() => fetchUsers(), handleGoBack())
    };

    // Update user state when role is Admin
    useEffect(() => {
        role === USER_ROLE_ADMIN &&
            fetchUsers()
    }, [role, fetchUsers])

    return (
        <UserContext.Provider value={{ selectedUser, userList, createUser, removeUser, updateUser, fetchUserById }}>
            {children}
        </UserContext.Provider>
    );
}