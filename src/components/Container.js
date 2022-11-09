import Header from "./Header"
import React, { useContext, useState } from "react"
import LoginContainer from "./LoginContainer"
import HomeContainer from "./HomeContainer"
import ServerAddrContext from "../contexts/ServerAddrContext"
import axios from "axios"

const Container = () => {
  /* Hooks */
  const SERVER_ADDR = useContext(ServerAddrContext)
  const [loggedInUser, setLoggedInUser] = useState(sessionStorage.getItem("loggedInUser"))

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
    }).then(({ data }) => {
        if (data.success) {
          sessionStorage.setItem("token", data.access_token)
          sessionStorage.setItem("loggedInUser", username)
          setLoggedInUser(username)
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

  /* Render */
  return (
    <div id="container">
      <Header loggedInUser={loggedInUser} onLogout={onLogout} />
      {
        sessionStorage.getItem("token") ?
        <HomeContainer loggedInUser={loggedInUser} onLogout={onLogout} /> :
        <LoginContainer onLogin={onLogin} />
      }
    </div>
  )
}

export default Container