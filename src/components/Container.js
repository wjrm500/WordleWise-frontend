import Header from "./Header"
import React, { useContext, useState } from "react"
import LoginContainer from "./LoginContainer"
import HomeContainer from "./HomeContainer"
import ServerAddrContext from "../contexts/ServerAddrContext"
import axios from "axios"
import StatusCodes from "http-status-codes";

const Container = () => {
  /* Hooks */
  const SERVER_ADDR = useContext(ServerAddrContext)
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(sessionStorage.getItem("loggedInUser")))
  const [scores, setScores] = useState({})
  const [users, setUsers] = useState({})
  const [dayIndex, setDayIndex] = useState(null)

  const postOptions = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    type: "cors"
  }

  /* Functions */
  const onLogin = (username, password, setLoginIsLoading) => {
    axios.post(
      SERVER_ADDR + "/login",
      {username, password},
      {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      type: "cors",
    }).then(({data}) => {
        if (data.success) {
          sessionStorage.setItem("token", data.access_token)
          sessionStorage.setItem("loggedInUser", JSON.stringify(data.user))
          setLoggedInUser(data.user)
        } else {
          setLoginIsLoading(false)
          alert(data.error)
        }
      })
      .catch(() => {
        setLoginIsLoading(false)
        alert("Something went wrong. Is the server running?")
      })
  }
  const onLogout = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("loggedInUser")
    setLoggedInUser(null)
  }
  const getScores = (init = true) => {
    axios.post(
      SERVER_ADDR + "/getScores",
      {timezone: Intl.DateTimeFormat().resolvedOptions().timeZone},
      postOptions
    ).then(({data}) => {
      setScores(data)
      if (init) {
        setDayIndex(data.length - 1)
      }
    }).catch(({response}) => {
      if (response.status == StatusCodes.UNAUTHORIZED) {
        onLogout()
      }
    })
  }
  const addScore = (date, user_id, score, init = true) => {
    axios.post(
      SERVER_ADDR + "/addScore",
      {date, user_id, score, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone},
      postOptions
    ).then(
      () => {
        getScores(init)
      }
    ).catch(({response}) => {
      if (response.status == StatusCodes.UNAUTHORIZED) {
        onLogout()
      }
    })
  }
  const getUsers = () => {
    axios.get(
      SERVER_ADDR + "/getUsers",
      postOptions
    ).then(({data}) => {
      setUsers(data)
    }).catch(({response}) => {
      if (response.status == StatusCodes.UNAUTHORIZED) {
        onLogout()
      }
    })
  }

  /* Render */
  return (
    <div id="container">
      <Header loggedInUser={loggedInUser} onLogout={onLogout} addScore={addScore} users={users} getUsers={getUsers} />
      {
        sessionStorage.getItem("token") ?
        <HomeContainer loggedInUser={loggedInUser} scores={scores} getScores={getScores} addScore={addScore} getUsers={getUsers} dayIndex={dayIndex} setDayIndex={setDayIndex} /> :
        <LoginContainer onLogin={onLogin} />
      }
    </div>
  )
}

export default Container