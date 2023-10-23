import Authentication from './Auth/Authentication';
import { AuthProvider } from './context/AuthProvider';
import { CommentProvider } from './context/CommentProvider';
import { ProjectProvider } from './context/ProjectProvider';
import { TaskProvider } from './context/TaskProvider';
import { TeamProvider } from './context/TeamProvider';
import { UserProvider } from './context/UserProvider';

function App() {

  return (
    <AuthProvider>
      <ProjectProvider>
        <UserProvider>
          <TeamProvider>
            <TaskProvider>
              <CommentProvider>
                
                {/* Start-Up Page */}
                <Authentication />   

              </CommentProvider>
            </TaskProvider>
          </TeamProvider>
        </UserProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
