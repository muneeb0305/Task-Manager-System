import { useContext } from "react";
import { UserContext } from "./UserProvider";
import { TeamContext } from "./TeamProvider";
import { TaskContext } from "./TaskProvider";
import { ProjectContext } from "./ProjectProvider";
import { AuthContext } from "./AuthProvider";
import { CommentContext } from "./CommentProvider";

// Export all the Contexts
export function useUserData() {
    return useContext(UserContext);
}
export function useTeamData() {
    return useContext(TeamContext);
}
export function useTaskData() {
    return useContext(TaskContext);
}
export function useProjectData() {
    return useContext(ProjectContext);
}
export function useCommentData() {
    return useContext(CommentContext);
}
export function useAuth() {
    return useContext(AuthContext);
}