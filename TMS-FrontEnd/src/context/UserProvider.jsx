import React, { createContext, useEffect, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import Alert from '../components/Alert';
import { USER_ROLE_ADMIN, host } from '../data/AppConstants';
import { useAuth } from '.';

export const UserContext = createContext();

export function UserProvider({ children }) {
    // User States
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    // Get Token from Token Provider
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role
    
    // Update user state when role is Admin
    useEffect(() => {
        role === USER_ROLE_ADMIN &&
            getUser()
                .catch((err) => Alert({ icon: 'error', title: err }))
        // eslint-disable-next-line
    }, [role])

    //Get All Users
    const getUser = async () => {
        const UserApi = `${host}/api/Users`
        const res = await FetchData(UserApi, token)
        setUser(res)
    }
    //Get User By ID
    const getUserById = async (id) => {
        const UserApi = `${host}/api/Users/${id}`;
        const res = await FetchData(UserApi, token);
        setSelectedUser(res)
    }
    // Delete User
    const removeUser = async (id) => {
        const deleteAPI = `${host}/api/Users/${id}`
        const res = await DeleteData(deleteAPI, token)
        getUser();
        return res
    };
    // Create User
    const create = async (newUser) => {
        const CreateApi = `${host}/api/Users`
        const res = await PostData(CreateApi, newUser, token)
        return res
    };
    // Update User
    const update = async (id, updatedUser) => {
        const UpdateApi = `${host}/api/Users/${id}`
        const res = await PutData(UpdateApi, updatedUser, token)
        return res
    };

    return (
        <UserContext.Provider value={{ selectedUser, user, create, removeUser, update, getUserById, getUser }}>
            {children}
        </UserContext.Provider>
    );
}