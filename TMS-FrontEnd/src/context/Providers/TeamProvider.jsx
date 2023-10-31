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
    const [team, setTeam] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamUsers, setTeamUsers] = useState([]);
    // Get Token
    const { token, userDetail } = useAuth()
    const role = userDetail && userDetail.role

    // Get All Teams
    const getTeam = useCallback(async () => {
        try {
            const TeamApi = `${host}/api/Team`
            const res = await FetchData(TeamApi, token)
            setTeam(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get Team by Team ID
    const getTeamById = useCallback(async (id) => {
        try {
            const TeamApi = `${host}/api/Team/${id}`;
            const res = await FetchData(TeamApi, token);
            setSelectedTeam(res)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get All users of team by Team ID
    const getTeamUsersById = useCallback(async (id) => {
        try {
            const TeamApi = `${host}/api/Team/users/${id}`;
            const result = await FetchData(TeamApi, token);
            setTeamUsers(result)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
    }, [token])

    // Get User Team By User Id
    const getUserTeam = useCallback(async (id) => {
        try {
            const TeamApi = `${host}/api/Team/user/${userDetail.ID}`;
            const res = await FetchData(TeamApi, token);
            const userTeam = res.find(t => t.id === Number(id))
            setTeam(res)
            if (id) {
                if (userTeam) {
                    setSelectedTeam(userTeam)
                }
                else {
                    navigate(- 1)
                    throw Error()
                }
            }
            res.length > 0 && getTeamUsersById(res[0].id)
        } catch (err) {
            Alert({ icon: 'error', title: err })
        }
        // eslint-disable-next-line
    }, [token, userDetail, getTeamUsersById])         //ignore navigate

    // Delete Team
    const removeTeam = async (id) => {
        try {
            const deleteAPI = `${host}/api/Team/${id}`
            const res = await DeleteData(deleteAPI, token)
            getTeam()
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
            getTeam()
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
            getTeam()
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
            getTeam()
        // if user than get its team
        role === USER_ROLE_USER &&
            getUserTeam()
    }, [role, getTeam, getUserTeam])

    return (
        <TeamContext.Provider value={{ getUserTeam, selectedTeam, teamUsers, team, create, removeTeam, update, getTeamById, getTeam, getTeamUsersById, unassignTeam, assignTeam }}>
            {children}
        </TeamContext.Provider>
    );
}