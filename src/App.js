import { useEffect, useState } from 'react';
import Container from './components/Container'

function App() {
  const SERVER_ADDR = process.env.REACT_APP_API_URL

  /* Use states */
  const [data, setData] = useState({})
  const [maxIndex, setMaxIndex] = useState(-1)
  const [loggedInUser, setLoggedInUser] = useState(sessionStorage.getItem('loggedInUser'))

  /* Functions */
  const getData = () => {
    fetch(SERVER_ADDR + "/getData", {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem('token')
      }
    })
      .then(async (resp) => {
        if (resp.status == 200) {
          const unwrappedJson = await resp.json()
          setData(unwrappedJson)
          setMaxIndex(unwrappedJson.length - 1)
        } else if (resp.status == 401) {
          onLogout()
        }
        
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
          sessionStorage.setItem('token', json.access_token)
          sessionStorage.setItem('loggedInUser', username)
          setLoggedInUser(username)
          getData()
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
  const onLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('loggedInUser')
    setLoggedInUser(null)
  }
  const addScore = (date, user, score) => {
    fetch(SERVER_ADDR + "/addScore", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer " + sessionStorage.getItem('token'),
        "Content-Type": "application/json"
      },
      type: "cors",
      body: JSON.stringify({date, user, score})
    })
      .then(getData)
  }

  useEffect(getData, [data.length])
  
  return (
    <div className="App">
      <Container loggedInUser={loggedInUser} onLogin={onLogin} onLogout={onLogout} addScore={addScore} data={data} maxIndex={maxIndex} setMaxIndex={setMaxIndex} />
    </div>
  );
}

export default App;
