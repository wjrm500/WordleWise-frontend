import { useState } from 'react';
import Container from './components/Container'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const onLogin = () => setLoggedIn(true)
  return (
    <div className="App">
      <Container loggedIn={loggedIn} onLogin={onLogin} />
    </div>
  );
}

export default App;
