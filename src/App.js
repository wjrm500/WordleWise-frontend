import { useState } from 'react';
import Container from './components/Container'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const onLogin = () => setLoggedIn(true)
  const onLogout = () => setLoggedIn(false)
  return (
    <div className="App">
      <Container loggedIn={loggedIn} onLogin={onLogin} onLogout={onLogout} />
    </div>
  );
}

export default App;
