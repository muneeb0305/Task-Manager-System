import React, { createContext, useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, HttpMethod, USER_ROLE_ADMIN } from '../../data/AppConstants';
import { useAuth } from '..';
import { useNavigate } from 'react-router-dom';
import { HandleAPI, handleError, handleSuccess } from '../../utils';
export const UserContext = createContext();

// API
const USER_API = API_ENDPOINTS.USER

export function UserProvider({ children }) {
    const navigate = useNavigate() 
    // Navigate back to the previous route
    const handleGoBack = useCallback(() => {
        navigate(-1);
        // eslint-disable-next-line
    }, []);             //ignore navigate

    // User States
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Get Token & userDetail from Auth
    const { token, userDetail } = useAuth()
    const role = userDetail?.role

    //Get All Users
    const fetchUsers = useCallback(async () => {
        try {
            const API = `${USER_API}`
            const res = await HandleAPI(API, HttpMethod.GET, token)
            setUserList(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    //Get User By ID
    const fetchUserById = useCallback(async (userId) => {
        try {
            const API = `${USER_API}/${userId}`;
            const res = await HandleAPI(API, HttpMethod.GET, token);
            setSelectedUser(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Delete User
    const removeUser = async (userId) => {
        try {
            const API = `${USER_API}/${userId}`
            const res = await HandleAPI(API, HttpMethod.DELETE, token);
            fetchUsers();  // Refresh User list
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Create User
    const create = async (newUser) => {
        try {
            const API = `${USER_API}`
            const res = await HandleAPI(API, HttpMethod.POST, token, newUser);
            handleSuccess(res)
            fetchUsers();  // Refresh User list
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Update User
    const update = async (userId, updatedUser) => {
        try {
            const API = `${USER_API}/${userId}`
            const res = await HandleAPI(API, HttpMethod.PUT, token, updatedUser)
            handleSuccess(res)
            fetchUsers()
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Update user state when role is Admin
    useEffect(() => {
        role === USER_ROLE_ADMIN &&
            fetchUsers()
    }, [role, fetchUsers])

    return (
        <UserContext.Provider value={{ selectedUser, userList, create, removeUser, update, fetchUserById, fetchUsers }}>
            {children}
        </UserContext.Provider>
    );
}