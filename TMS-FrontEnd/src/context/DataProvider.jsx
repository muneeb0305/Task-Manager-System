import React, { createContext, useContext, useEffect, useState } from 'react';
import { FetchData } from '../utils/FetchData';
import { useToken } from './TokenProvider';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [data, setData] = useState([]);
    const [project, setProject] = useState([]);
    const [user, setUsers] = useState([]);
    const [team, setTeams] = useState([]);
    const { token } = useToken()
    useEffect(() => {
        const projectApi = 'https://localhost:7174/api/Project'
        FetchData(projectApi, token)
            .then(res => {
                setProject(res)
            })
            .catch(err => {
                console.log(err)
            })
        const userApi = 'https://localhost:7174/api/Users'
        FetchData(userApi, token)
            .then(res => {
                setUsers(res)
            })
            .catch(err => {
                console.log(err)
            })
        const TeamApi = 'https://localhost:7174/api/Team'
        FetchData(TeamApi, token)
            .then(res => {
                setTeams(res)
            })
            .catch(err => {
                console.log(err)
            })
        // eslint-disable-next-line
    }, [])
    const SetData = (arr) => {
        setData(arr);
    };

    const removeData = (id, name) => {
        if (name === 'Project') {
            const newData = project.filter(d => d.id !== id)
            setProject(newData);
        }
        else if (name === 'User') {
            const newData = user.filter(d => d.id !== id)
            setUsers(newData);
        }
        else if (name === 'Team') {
            const newData = team.filter(d => d.id !== id)
            setTeams(newData);
        }
    };

    return (
        <DataContext.Provider value={{ data, SetData, removeData, project, user, team }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
