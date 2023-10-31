import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FetchData } from '../../utils/FetchData';
import { DeleteData } from '../../utils/DeleteData';
import { PostData } from '../../utils/PostData';
import { PutData } from '../../utils/PutData';
import Alert from '../../components/Alert';
import { USER_ROLE_ADMIN, host } from '../../data/AppConstants';
import { useAuth } from '..';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const navigate = useNavigate()
    // User States
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    // Get Token from Token Provider
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    //Get All Users
    const getUser = useCallback(async () => {
        try {
            const UserApi = `${host}/api/Users`
            const res = await FetchData(UserApi, token)
            setUser(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    //Get User By ID
    const getUserById = useCallback(async (id) => {
        try {
            const UserApi = `${host}/api/Users/${id}`;
            const res = await FetchData(UserApi, token);
            setSelectedUser(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Delete User
    const removeUser = async (id) => {
        try {
            const deleteAPI = `${host}/api/Users/${id}`
            const res = await DeleteData(deleteAPI, token)
            getUser();  // Refresh User list
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Create User
    const create = async (newUser) => {
        try {
            const CreateApi = `${host}/api/Users`
            const res = await PostData(CreateApi, newUser, token)
            Alert({ icon: 'success', title: res })
            getUser();  // Refresh User list
            navigate('/user')
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };
    
    // Update User
    const update = async (id, updatedUser) => {
        try {
            const UpdateApi = `${host}/api/Users/${id}`
            const res = await PutData(UpdateApi, updatedUser, token)
            Alert({ icon: 'success', title: res })
            getUser()
            navigate('/user')
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Update user state when role is Admin
    useEffect(() => {
        role === USER_ROLE_ADMIN &&
            getUser()
    }, [role, getUser])

    return (
        <UserContext.Provider value={{ selectedUser, user, create, removeUser, update, getUserById, getUser }}>
            {children}
        </UserContext.Provider>
    );
}