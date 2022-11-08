import { useEffect, useState } from 'react';
import Container from './components/Container'

function App() {
  const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));
  const SERVER_ADDR = process.env.REACT_APP_API_URL

  /* Use states */
  const [dayData, setDayData] = useState({})
  const [weekData, setWeekData] = useState({})
  const [dayMaxIndex, setDayMaxIndex] = useState(-1)
  const [weekMaxIndex, setWeekMaxIndex] = useState(-1)
  const [loggedInUser, setLoggedInUser] = useState(sessionStorage.getItem('loggedInUser'))

  /* Functions */
  const consolidateWeek = (weekData) => {
    return {
      StartDate: weekData[0].Date,
      KateTotal: weekData.reduce((sum, obj) => sum + obj.Kate, 0),
      WillTotal: weekData.reduce((sum, obj) => sum + obj.Will, 0)
    }
  }
  const getData = () => {
    fetch(SERVER_ADDR + "/getData", {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem('token')
      }
    })
      .then(async (resp) => {
        if (resp.status == 200) {
          const data = await resp.json()
          setDayData(data)
          setDayMaxIndex(data.length - 1)
          let weekAggregatedData = data.map(consolidateWeek)
          weekAggregatedData = array_chunks(weekAggregatedData, 7)
          setWeekData(weekAggregatedData)
          setWeekMaxIndex(weekAggregatedData.length - 1)
          
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

  useEffect(getData, [dayData.length])
  
  return (
    <div className="App">
      <Container loggedInUser={loggedInUser} onLogin={onLogin} onLogout={onLogout} addScore={addScore} dayData={dayData} dayMaxIndex={dayMaxIndex} setDayMaxIndex={setDayMaxIndex} weekData={weekData} weekMaxIndex={weekMaxIndex} setWeekMaxIndex={setWeekMaxIndex} />
    </div>
  );
}

export default App;
