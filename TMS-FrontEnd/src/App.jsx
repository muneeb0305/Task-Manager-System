import Authentication from './Auth/Authentication';
import AppProviders from './context/Providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <Authentication />
    </AppProviders>
  );
}

export default App;
