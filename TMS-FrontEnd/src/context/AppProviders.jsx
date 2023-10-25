import React from 'react'
import { AuthProvider } from './AuthProvider'
import { ProjectProvider } from './ProjectProvider'
import { UserProvider } from './UserProvider'
import { TeamProvider } from './TeamProvider'
import { TaskProvider } from './TaskProvider'
import { CommentProvider } from './CommentProvider'

export default function AppProviders({ children }) {
    return (
        <AuthProvider>
            <ProjectProvider>
                <UserProvider>
                    <TeamProvider>
                        <TaskProvider>
                            <CommentProvider>
                                {children}
                            </CommentProvider>
                        </TaskProvider>
                    </TeamProvider>
                </UserProvider>
            </ProjectProvider>
        </AuthProvider>
    )
}
