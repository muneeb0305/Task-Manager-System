import { useContext } from "react";
import { UserContext } from "./Providers/UserProvider";
import { TeamContext } from "./Providers/TeamProvider";
import { TaskContext } from "./Providers/TaskProvider";
import { ProjectContext } from "./Providers/ProjectProvider";
import { AuthContext } from "./Providers/AuthProvider";
import { CommentContext } from "./Providers/CommentProvider";

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