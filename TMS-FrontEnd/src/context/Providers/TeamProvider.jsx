import React, { createContext, useCallback, useEffect, useState } from 'react';
import { DeleteData, FetchData, PostData, PutData, handleError, handleSuccess } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { TEAM_API, USER_API, USER_ROLE_ADMIN, USER_ROLE_USER } from '../../data/AppConstants';
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
    const role = userDetail?.role

    // Get All Teams
    const fetchTeam = useCallback(async () => {
        try {
            const API = `${TEAM_API}`
            const res = await FetchData(API, token)
            setTeamList(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Get Team by Team ID
    const fetchTeamById = useCallback(async (teamId) => {
        try {
            const API = `${TEAM_API}/${teamId}`;
            const res = await FetchData(API, token);
            setSelectedTeam(res)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Get All users with team by Team ID
    const fetchTeamUsersById = useCallback(async (teamId) => {
        try {
            const API = `${TEAM_API}/users/${teamId}`;
            const result = await FetchData(API, token);
            setTeamUsers(result)
        } catch (err) {
            handleError(err)
        }
    }, [token])

    // Get User Team By User Id
    const fetchUserTeam = useCallback(async (userId, teamId) => {
        try {
            const API = `${TEAM_API}/user/${userId}`;
            const res = await FetchData(API, token);
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
            handleError(err)
        }
    }, [token, fetchTeamUsersById, handleGoBack])

    // Delete Team
    const removeTeam = async (teamId) => {
        try {
            const API = `${TEAM_API}/${teamId}`
            const res = await DeleteData(API, token)
            fetchTeam()
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Create Team
    const create = async (newTeam) => {
        try {
            const API = `${TEAM_API}`
            const res = await PostData(API, newTeam, token)
            fetchTeam()
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Update Team
    const update = async (teamId, updatedTeam) => {
        try {
            const API = `${TEAM_API}/${teamId}`
            const res = await PutData(API, updatedTeam, token)
            fetchTeam()
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
        }
    };

    // Unassign Team
    const unassignTeam = async (userId) => {
        try {
            const API = `${USER_API}/remove_team/${userId}`
            const res = await DeleteData(API, token)
            const newData = teamUsers.filter(u => u.id !== userId)
            setTeamUsers(newData)
            handleSuccess(res)
        } catch (err) {
            handleError(err)
        }
    };

    // Assign Team to User
    const assignTeam = async (form) => {
        try {
            const API = `${USER_API}/assign_team`
            const res = await PutData(API, form, token)
            handleSuccess(res)
            handleGoBack()
        } catch (err) {
            handleError(err)
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