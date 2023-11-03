import React, { createContext, useCallback, useEffect, useState } from 'react';
import { create, fetch, remove, update } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, USER_ROLE_ADMIN, USER_ROLE_USER } from '../../data/AppConstants';
import { useAuth } from '..';
export const TeamContext = createContext();

// API
const TEAM_API = API_ENDPOINTS.TEAM
const USER_API = API_ENDPOINTS.USER

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

    // Functions Related to Team
    const fetchTeam = useCallback(async () => {
        fetch(TEAM_API, token)
            .then(res => setTeamList(res))
    }, [token])

    const fetchTeamById = useCallback(async (teamId) => {
        const API = `${TEAM_API}/${teamId}`;
        fetch(API, token)
            .then(res => setSelectedTeam(res))
    }, [token])

    const fetchTeamUsersById = useCallback(async (teamId) => {
        const API = `${TEAM_API}/users/${teamId}`;
        fetch(API, token)
            .then(res => setTeamUsers(res))
    }, [token])

    const fetchUserTeam = useCallback(async (userId, teamId) => {
        const API = `${TEAM_API}/user/${userId}`;
        fetch(API, token)
            .then(res => {
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
            })
    }, [token, fetchTeamUsersById, handleGoBack])

    const removeTeam = async (teamId) => {
        const API = `${TEAM_API}/${teamId}`
        remove(API, token)
            .then(() => fetchTeam())
    };

    const createTeam = async (newTeam) => {
        create(TEAM_API, token, newTeam)
            .then(() => fetchTeam(), handleGoBack())
    };

    const updateTeam = async (teamId, updatedTeam) => {
        const API = `${TEAM_API}/${teamId}`
        update(API, token, updatedTeam)
            .then(() => fetchTeam(), handleGoBack())
    };

    const unassignTeam = async (userId) => {
        const API = `${USER_API}/remove_team/${userId}`
        remove(API, token)
            .then(() => {
                const newData = teamUsers.filter(u => u.id !== userId)
                setTeamUsers(newData)
            })
    };

    const assignTeam = async (form) => {
        const API = `${USER_API}/assign_team`
        update(API, token, form)
            .then(() => handleGoBack())
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
        <TeamContext.Provider value={{ fetchUserTeam, selectedTeam, teamUsers, teamList, createTeam, removeTeam, updateTeam, fetchTeamById, fetchTeamUsersById, unassignTeam, assignTeam }}>
            {children}
        </TeamContext.Provider>
    );
}