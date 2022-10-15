import { useEffect, useState } from 'react';
import Container from './components/Container'

function App() {
  const [cwData, setCwData] = useState({})
  useEffect(() => {
    fetch("http://localhost:5000/currentWeekData")
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json)
        setCwData(json)
      })
  }, [])
  const [loggedIn, setLoggedIn] = useState(false)
  const onLogin = () => setLoggedIn(true)
  const onLogout = () => setLoggedIn(false)
  return (
    <div className="App">
      <Container loggedIn={loggedIn} onLogin={onLogin} onLogout={onLogout} cwData={cwData} />
    </div>
  );
}

export default App;
