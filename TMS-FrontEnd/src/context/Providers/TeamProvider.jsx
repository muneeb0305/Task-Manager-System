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
        const TeamApi = `${host}/api/Team`
        const res = await FetchData(TeamApi, token)
        setTeam(res)
    }, [token])
    // Get Team by Team ID
    const getTeamById = useCallback(async (id) => {
        const TeamApi = `${host}/api/Team/${id}`;
        const res = await FetchData(TeamApi, token);
        setSelectedTeam(res)
    }, [token])
    // Get User Team By User Id
    const getUserTeam = useCallback(async (id) => {
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
        return res[0]
        // eslint-disable-next-line 
    }, [token, userDetail])         //ignore navigate
    // Delete Team
    const removeTeam = async (id) => {
        const deleteAPI = `${host}/api/Team/${id}`
        const res = await DeleteData(deleteAPI, token)
        getTeam()
        return res
    };
    // Create Team
    const create = async (newProject) => {
        const CreateApi = `${host}/api/Team`
        const res = await PostData(CreateApi, newProject, token)
        getTeam()
        return res
    };
    // Update Team
    const update = async (id, editProject) => {
        const UpdateApi = `${host}/api/Team/${id}`
        const res = await PutData(UpdateApi, editProject, token)
        getTeam()
        return res
    };
    // Get All users of team by Team ID
    const getTeamUsersById = useCallback(async (id) => {
        const TeamApi = `${host}/api/Team/users/${id}`;
        const result = await FetchData(TeamApi, token);
        setTeamUsers(result)
    }, [token])
    // Unassign Team
    const unassignTeam = async (id) => {
        const deleteAPI = `${host}/api/Users/remove_team/${id}`
        const res = await DeleteData(deleteAPI, token)
        const newData = teamUsers.filter(u => u.id !== id)
        setTeamUsers(newData)
        return res
    };
    // Assign Team to User
    const assignTeam = async (form) => {
        const AssignTeamApi = `${host}/api/Users/assign_team`
        const res = await PutData(AssignTeamApi, form, token)
        return res
    };

    // Update team state according to user role. 
    useEffect(() => {
        // If admin then get all teams
        role === USER_ROLE_ADMIN &&
            getTeam()
                .catch((err) => Alert({ icon: 'error', title: err }))
        // if user than get its team
        role === USER_ROLE_USER &&
            getUserTeam()
                .catch((err) => Alert({ icon: 'error', title: err }))

    }, [role, getTeam, getUserTeam])

    return (
        <TeamContext.Provider value={{ getUserTeam, selectedTeam, teamUsers, team, create, removeTeam, update, getTeamById, getTeam, getTeamUsersById, unassignTeam, assignTeam }}>
            {children}
        </TeamContext.Provider>
    );
}