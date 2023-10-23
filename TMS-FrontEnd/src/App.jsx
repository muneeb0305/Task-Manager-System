import Authentication from './Auth/Authentication';
import AppProviders from './context/AppProviders';
function App() {

  return (
    <AppProviders>
      <Authentication />
    </AppProviders>
  );
}

export default App;
