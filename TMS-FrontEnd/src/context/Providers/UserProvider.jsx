import React, { createContext, useCallback, useEffect, useState } from 'react';
import { USER_ROLE_ADMIN, host } from '../../data/AppConstants';
import { useAuth } from '..';
import { useNavigate } from 'react-router-dom';
import { DeleteData, FetchData, PostData, PutData, handleError, handleSuccess } from '../../utils';

export const UserContext = createContext();

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
    // Get Token from Token Provider
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    //Get All Users
    const fetchUsers = useCallback(async () => {
        try {
            const UserApi = `${host}/api/Users`
            const res = await FetchData(UserApi, token)
            setUserList(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    //Get User By ID
    const fetchUserById = useCallback(async (userId) => {
        try {
            const UserApi = `${host}/api/Users/${userId}`;
            const res = await FetchData(UserApi, token);
            setSelectedUser(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Delete User
    const removeUser = async (userId) => {
        try {
            const deleteAPI = `${host}/api/Users/${userId}`
            const res = await DeleteData(deleteAPI, token)
            fetchUsers();  // Refresh User list
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Create User
    const create = async (newUser) => {
        try {
            const CreateApi = `${host}/api/Users`
            const res = await PostData(CreateApi, newUser, token)
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
            const UpdateApi = `${host}/api/Users/${userId}`
            const res = await PutData(UpdateApi, updatedUser, token)
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