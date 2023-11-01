import React, { createContext, useCallback, useEffect, useState } from 'react';
import { DeleteData, FetchData, PostData, PutData } from '../../utils';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE_ADMIN, USER_ROLE_USER, host } from '../../data/AppConstants';
import { useAuth } from '..';

export const TeamContext = createContext();

export function TeamProvider({ children }) {
    const navigate = useNavigate()
    // Navigate back to the previous route
    const handleGoBack = useCallback(() => {
        navigate(-1);
        // eslint-disable-next-line
    }, []);             //ignore navigate
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
    const fetchTeamById = useCallback(async (teamId) => {
        try {
            const TeamApi = `${host}/api/Team/${teamId}`;
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
    const fetchUserTeam = useCallback(async (userId, teamId) => {
        try {
            const TeamApi = `${host}/api/Team/user/${userId}`;
            const res = await FetchData(TeamApi, token);
            setTeamList(res)    //for table
            if (teamId) {
                const checkTeam = res.find(t => t.id === Number(teamId))
                if (checkTeam) {
                    setSelectedTeam(checkTeam) //for Detail view
                    fetchTeamUsersById(checkTeam.id) // fetch users of that team
                }
                else {
                    handleGoBack()
                }
            }
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token, fetchTeamUsersById, handleGoBack])

    // Delete Team
    const removeTeam = async (teamId) => {
        try {
            const deleteAPI = `${host}/api/Team/${teamId}`
            const res = await DeleteData(deleteAPI, token)
            fetchTeam()
            Alert({ icon: 'success', title: res })
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Create Team
    const create = async (newTeam) => {
        try {
            const CreateApi = `${host}/api/Team`
            const res = await PostData(CreateApi, newTeam, token)
            fetchTeam()
            Alert({ icon: 'success', title: res })
            handleGoBack()
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Update Team
    const update = async (teamId, updatedTeam) => {
        try {
            const UpdateApi = `${host}/api/Team/${teamId}`
            const res = await PutData(UpdateApi, updatedTeam, token)
            fetchTeam()
            Alert({ icon: 'success', title: res })
            handleGoBack()
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    };

    // Unassign Team
    const unassignTeam = async (userId) => {
        try {
            const deleteAPI = `${host}/api/Users/remove_team/${userId}`
            const res = await DeleteData(deleteAPI, token)
            const newData = teamUsers.filter(u => u.id !== userId)
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
            handleGoBack()
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
            fetchUserTeam(userDetail.ID)
    }, [role, fetchTeam, fetchUserTeam, userDetail])

    return (
        <TeamContext.Provider value={{ fetchUserTeam, selectedTeam, teamUsers, teamList, create, removeTeam, update, fetchTeamById, fetchTeam, fetchTeamUsersById, unassignTeam, assignTeam }}>
            {children}
        </TeamContext.Provider>
    );
}