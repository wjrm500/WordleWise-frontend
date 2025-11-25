import Header from "./Header"
import React, { useState } from "react"
import LoginContainer from "./LoginContainer"
import HomeContainer from "./HomeContainer"
import AuthContext from "../contexts/AuthContext"
import ScopeProvider from "./scope/ScopeProvider"
import api from "../utilities/api"
import StatusCodes from "http-status-codes"

const Container = () => {
  // Auth State
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem("loggedInUser")))
  const [token, setToken] = useState(localStorage.getItem("token"))

  // Data State
  const [users, setUsers] = useState({})
  // Track by week start date instead of index
  const [currentWeekStart, setCurrentWeekStart] = useState(null)

  const isAuthenticated = !!token;
  const isSiteAdmin = loggedInUser?.admin === 1;

  const onLogin = async (username, password, setLoginIsLoading) => {
    try {
      const { data } = await api.post("/login", { username, password });
      if (data.success) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("loggedInUser", JSON.stringify(data.user))
        setToken(data.access_token)
        setLoggedInUser(data.user)
      } else {
        setLoginIsLoading(false)
        alert(data.error)
      }
    } catch (error) {
      setLoginIsLoading(false)
      alert("Something went wrong. Is the server running?")
    }
  }

  const onLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("loggedInUser")
    setToken(null)
    setLoggedInUser(null)
    setCurrentWeekStart(null)
  }

  const getUsers = () => {
    api.get("/getUsers")
      .then(({ data }) => {
        setUsers(data)
      }).catch((error) => {
        if (error.response && error.response.status === StatusCodes.UNAUTHORIZED) {
          onLogout()
        }
      })
  }

  return (
    <AuthContext.Provider value={{
      user: loggedInUser,
      token,
      login: onLogin,
      logout: onLogout,
      isAuthenticated,
      isSiteAdmin
    }}>
      <ScopeProvider>
        <div id="container">
          <Header
            loggedInUser={loggedInUser}
            onLogout={onLogout}
          />
          {
            isAuthenticated ?
              <HomeContainer
                loggedInUser={loggedInUser}
                getUsers={getUsers}
                users={users}
                currentWeekStart={currentWeekStart}
                setCurrentWeekStart={setCurrentWeekStart}
              /> :
              <LoginContainer onLogin={onLogin} />
          }
        </div>
      </ScopeProvider>
    </AuthContext.Provider>
  )
}

export default Container