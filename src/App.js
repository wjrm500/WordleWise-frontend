import { useEffect, useState } from 'react';
import Container from './components/Container'

function App() {
  const [cwData, setCwData] = useState({})
  const [cwIndex, setCwIndex] = useState(0)
  const getData = () => {
    fetch("http://localhost:5000/getData")
      .then((resp) => resp.json())
      .then((json) => {
        setCwData(json)
        setCwIndex(cwData.length - 1)
        console.log(cwData)
      })
  }
  useEffect(getData, [cwData.length])
  const [loggedInUser, setLoggedInUser] = useState(null)
  const onLogin = (username) => setLoggedInUser(username)
  const onLogout = () => setLoggedInUser(null)
  const addScore = (date, user, score) => {
    console.log({date, user, score})
    fetch("http://localhost:5000/addScore", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      type: "cors",
      body: JSON.stringify({date, user, score})
    })
      .then((resp) => resp.json())
      .then((json) => {
        getData()
      })
  }
  return (
    <div className="App">
      <Container loggedInUser={loggedInUser} onLogin={onLogin} onLogout={onLogout} addScore={addScore} cwData={cwData} cwIndex={cwIndex} setCwIndex={setCwIndex} />
    </div>
  );
}

export default App;
