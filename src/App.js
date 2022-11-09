import Container from './components/Container'
import ServerAddrContext from './contexts/ServerAddrContext';

function App() {
  return (
    <ServerAddrContext.Provider value={process.env.REACT_APP_API_URL}>
      <div className="App">
        <Container />
      </div>
    </ServerAddrContext.Provider>
  );
}

export default App;
