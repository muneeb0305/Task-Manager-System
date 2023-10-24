import React, { createContext, useContext, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { DeleteData } from '../utils/DeleteData';
import { PostData } from '../utils/PostData';
import { PutData } from '../utils/PutData';
import { useAuth } from './AuthProvider';

const TeamContext = createContext();

export function TeamProvider({ children }) {
    // States
    const [team, setTeam] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamUsers, setTeamUsers] = useState([]);
    // Get Token
    const { token, userDetail } = useAuth()

    // Get All Teams
    const getTeam = async () => {
        const TeamApi = 'https://localhost:7174/api/Team'
        const res = await FetchData(TeamApi, token)
        setTeam(res)
    }
    // Get Team by Team ID
    const getTeamById = async (id) => {
        const TeamApi = `https://localhost:7174/api/Team/${id}`;
        const res = await FetchData(TeamApi, token);
        setSelectedTeam(res)
    }
    // Get User Team 
    const getUserTeam = async () => {
        const TeamApi = `https://localhost:7174/api/Team/user/${userDetail.ID}`;
        const res = await FetchData(TeamApi, token);
        setTeam([res])
    }
    // Delete Team
    const remove = async (id) => {
        const deleteAPI = `https://localhost:7174/api/Team/${id}`
        await DeleteData(deleteAPI, token)
        getTeam()
    };
    // Create Team
    const create = async (newProject) => {
        const CreateApi = `https://localhost:7174/api/Team`
        const res = await PostData(CreateApi, newProject, token)
        getTeam()
        return res
    };
    // Update Team
    const update = async (id, editProject) => {
        const UpdateApi = `https://localhost:7174/api/Team/${id}`
        const res = await PutData(UpdateApi, editProject, token)
        getTeam()
        return res
    };
    // Get All users of team by Team ID
    const getTeamUsersById = async (id) => {
        const TeamApi = `https://localhost:7174/api/Team/users/${id}`;
        const result = await FetchData(TeamApi, token);
        setTeamUsers(result)
    }
    // Unassign Team
    const unassignTeam = async (id) => {
        const deleteAPI = `https://localhost:7174/api/Users/remove_team/${id}`
        await DeleteData(deleteAPI, token)
        const newData = teamUsers.filter(u => u.id !== id)
        setTeamUsers(newData)
    };
    // Assign Team to User
    const assignTeam = async (form) => {
        const AssignTeamApi = `https://localhost:7174/api/Users/assign_team`
        const res = await PutData(AssignTeamApi, form, token)
        return res
    };

    return (
        <TeamContext.Provider value={{ getUserTeam, selectedTeam, teamUsers, team, create, remove, update, getTeamById, getTeam, getTeamUsersById, unassignTeam, assignTeam }}>
            {children}
        </TeamContext.Provider>
    );
}

export function useTeamData() {
    return useContext(TeamContext);
}
