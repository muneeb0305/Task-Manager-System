import React, { createContext, useContext, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import { useToken } from './TokenProvider';

const UserContext = createContext();

export function UserProvider({ children }) {
    // User State
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    // Get Token from Token Provider
    const { token } = useToken()

    //Get All Users
    const getUser = async () => {
        const UserApi = 'https://localhost:7174/api/Users'
        const res = await FetchData(UserApi, token)
        setUser(res)
    }
    //Get User By ID
    const getUserById = async (id) => {
        const UserApi = `https://localhost:7174/api/Users/${id}`;
        const res = await FetchData(UserApi, token);
        setSelectedUser(res)
    }
    // Delete User
    const remove = async (id) => {
        const deleteAPI = `https://localhost:7174/api/Users/${id}`
        await DeleteData(deleteAPI, token)
        getUser();
    };
    // Create User
    const create = async (newUser) => {
        const CreateApi = `https://localhost:7174/api/Users`
        const res = await PostData(CreateApi, newUser, token)
        return res
    };
    // Update User
    const update = async (id, updatedUser) => {
        const UpdateApi = `https://localhost:7174/api/Users/${id}`
        const res = await PutData(UpdateApi, updatedUser, token)
        return res
    };
    
    return (
        <UserContext.Provider value={{ selectedUser, user, create, remove, update, getUserById, getUser}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserData() {
    return useContext(UserContext);
}
