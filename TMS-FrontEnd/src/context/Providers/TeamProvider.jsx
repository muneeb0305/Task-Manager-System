import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FetchData } from '../../utils/FetchData';
import { DeleteData } from '../../utils/DeleteData';
import { PostData } from '../../utils/PostData';
import { PutData } from '../../utils/PutData';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_ADMIN, USER_ROLE_USER, host } from '../../data/AppConstants';
import { useAuth } from '..';

export const TeamContext = createContext();

export function TeamProvider({ children }) {
    const navigate = useNavigate()
    // States
    const [teamList, setTeamList] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamUsers, setTeamUsers] = useState([]);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    // Get All Teams
    const fetchTeam = useCallback(async () => {
        try {
            const TeamApi = `${host}/api/Team`
            const res = await FetchData(TeamApi, token)
            setTeamList(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get Team by Team ID
    const fetchTeamById = useCallback(async (id) => {
        try {
            const TeamApi = `${host}/api/Team/${id}`;
            const res = await FetchData(TeamApi, token);
            setSelectedTeam(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get All users with team by Team ID
    const fetchTeamUsersById = useCallback(async (teamId) => {
        try {
            const TeamApi = `${host}/api/Team/users/${teamId}`;
            const result = await FetchData(TeamApi, token);
            setTeamUsers(result)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get User Team By User Id
    const fetchUserTeam = useCallback(async (userId) => {
        try {
            const TeamApi = `${host}/api/Team/user/${userId}`;
            const res = await FetchData(TeamApi, token);
            setTeamList(res)    //for table
            if (userId) {
                if (res.length > 0) {
                    setSelectedTeam(res[0]) //for Detail view
                }
                else {
                    navigate(- 1)
                    throw Error()
                }
            }
            res.length > 0 && fetchTeamUsersById(res[0].id) // fetch users of that team
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
        // eslint-disable-next-line
    }, [token, userDetail, fetchTeamUsersById])         //ignore navigate

    // Delete Team
    const removeTeam = async (id) => {
        try {
            const deleteAPI = `${host}/api/Team/${id}`
            const res = await DeleteData(deleteAPI, token)
            fetchTeam()
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Create Team
    const create = async (newProject) => {
        try {
            const CreateApi = `${host}/api/Team`
            const res = await PostData(CreateApi, newProject, token)
            fetchTeam()
            Alert({ icon: 'success', title: res })
            navigate('/team')
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Update Team
    const update = async (id, editProject) => {
        try {
            const UpdateApi = `${host}/api/Team/${id}`
            const res = await PutData(UpdateApi, editProject, token)
            fetchTeam()
            Alert({ icon: 'success', title: res })
            navigate('/team')
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Unassign Team
    const unassignTeam = async (id) => {
        try {
            const deleteAPI = `${host}/api/Users/remove_team/${id}`
            const res = await DeleteData(deleteAPI, token)
            const newData = teamUsers.filter(u => u.id !== id)
            setTeamUsers(newData)
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Assign Team to User
    const assignTeam = async (form) => {
        try {
            const AssignTeamApi = `${host}/api/Users/assign_team`
            const res = await PutData(AssignTeamApi, form, token)
            Alert({ icon: 'success', title: res })
            navigate(-1)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Update team state according to user role. 
    useEffect(() => {
        // If admin then get all teams
        role === USER_ROLE_ADMIN &&
            fetchTeam()
        // if user than get its team
        role === USER_ROLE_USER &&
            fetchUserTeam()
    }, [role, fetchTeam, fetchUserTeam])

    return (
        <TeamContext.Provider value={{ fetchUserTeam, selectedTeam, teamUsers, teamList, create, removeTeam, update, fetchTeamById, fetchTeam, fetchTeamUsersById, unassignTeam, assignTeam }}>
            {children}
        </TeamContext.Provider>
    );
}