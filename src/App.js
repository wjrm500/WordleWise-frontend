import { useContext, useState } from 'react';
import Container from './components/Container'
import ServerAddrContext from './contexts/ServerAddrContext';

function App() {
  const SERVER_ADDR = useContext(ServerAddrContext)

  /* Use states */
  const [loggedInUser, setLoggedInUser] = useState(sessionStorage.getItem('loggedInUser'))

  /* Functions */
  const onLogin = (username, password, setLoginIsLoading) => {
    console.log(SERVER_ADDR)
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
  
  return (
    <ServerAddrContext.Provider value={process.env.REACT_APP_API_URL}>
      <div className="App">
        <Container loggedInUser={loggedInUser} onLogin={onLogin} onLogout={onLogout} />
      </div>
    </ServerAddrContext.Provider>
  );
}

export default App;
