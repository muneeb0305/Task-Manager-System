import Authentication from './Auth/Authentication';
import { CommentProvider } from './context/CommentProvider';
import { ProjectProvider } from './context/ProjectProvider';
import { TaskProvider } from './context/TaskProvider';
import { TeamProvider } from './context/TeamProvider';
import { TokenProvider } from './context/TokenProvider';
import { UserProvider } from './context/UserProvider';

function App() {

  return (
    <>
      <TokenProvider>
        <ProjectProvider>
          <UserProvider>
            <TeamProvider>
              <TaskProvider>
                <CommentProvider>
                  <Authentication />
                </CommentProvider>
              </TaskProvider>
            </TeamProvider>
          </UserProvider>
        </ProjectProvider>
      </TokenProvider>
    </>
  );
}

export default App;
