import { useState } from 'react';
import Container from './components/Container'

function App() {
  const [loggedIn, setLoggedIn] = useState(true)
  return (
    <div className="App">
      <Container loggedIn={loggedIn} />
    </div>
  );
}

export default App;
