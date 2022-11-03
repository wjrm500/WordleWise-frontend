import { useEffect, useState } from 'react';
import Container from './components/Container'

function App() {
  alert(process.env.REACT_APP_API_URL)
  const SERVER_ADDR = process.env.REACT_APP_API_URL

  /* Use states */
  const [cwData, setCwData] = useState({})
  const [cwIndex, setCwIndex] = useState(0)
  const [loggedInUser, setLoggedInUser] = useState(null)

  /* Functions */
  const getData = () => {
    fetch(SERVER_ADDR + "/getData")
      .then((resp) => resp.json())
      .then((json) => {
        setCwData(json)
        setCwIndex(cwData.length - 1)
      })
  }
  const onLogin = (username, password, setLoginIsLoading) => {
    fetch(SERVER_ADDR + "/login", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      type: "cors",
      body: JSON.stringify({username, password})
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.success) {
          setLoggedInUser(username)
        } else {
          setLoginIsLoading(false)
          alert(json.error)
        }
      })
      .catch(() => {
        setLoginIsLoading(false)
        alert('Something went wrong. Is the server running?')
      })
  }
  const onLogout = () => setLoggedInUser(null)
  const addScore = (date, user, score) => {
    fetch(SERVER_ADDR + "/addScore", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      type: "cors",
      body: JSON.stringify({date, user, score})
    })
      .then(getData)
  }

  /* Use effects */
  useEffect(getData, [cwData.length])
  
  return (
    <div className="App">
      <Container loggedInUser={loggedInUser} onLogin={onLogin} onLogout={onLogout} addScore={addScore} cwData={cwData} cwIndex={cwIndex} setCwIndex={setCwIndex} />
    </div>
  );
}

export default App;
