import { useEffect, useState } from 'react';
import Container from './components/Container'

function App() {
  const [cwData, setCwData] = useState({})
  const [cwIndex, setCwIndex] = useState(0)
  useEffect(() => {
    fetch("http://localhost:5000/getData")
      .then((resp) => resp.json())
      .then((json) => {
        setCwData(json)
        setCwIndex(cwData.length - 1)
      })
  }, [cwData.length])
  
  const [loggedInUser, setLoggedInUser] = useState(null)
  const onLogin = (username) => setLoggedInUser(username)
  const onLogout = () => setLoggedInUser(null)
  return (
    <div className="App">
      <Container loggedInUser={loggedInUser} onLogin={onLogin} onLogout={onLogout} cwData={cwData} cwIndex={cwIndex} setCwIndex={setCwIndex} />
    </div>
  );
}

export default App;
