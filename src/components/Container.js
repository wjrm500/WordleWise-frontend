import Header from "./Header"
import React, { useState, useEffect, useCallback } from "react"
import LoginContainer from "./LoginContainer"
import HomeContainer from "./HomeContainer"
import AuthContext from "../contexts/AuthContext"
import ScopeProvider from "./scope/ScopeProvider"
import api from "../utilities/api"

const Container = () => {
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem("loggedInUser")))
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [currentWeekStart, setCurrentWeekStart] = useState(null)

  const isAuthenticated = !!token;

  const onLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("loggedInUser")
    setToken(null)
    setLoggedInUser(null)
    setCurrentWeekStart(null)
  }, []);

  useEffect(() => {
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [onLogout]);

  const onLogin = async (username, password, setLoginIsLoading, setLoginError) => {
    try {
      const { data } = await api.post("/login", { username, password });
      if (data.success) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("loggedInUser", JSON.stringify(data.user))
        setToken(data.access_token)
        setLoggedInUser(data.user)
      } else {
        setLoginIsLoading(false)
        setLoginError(data.error)
      }
    } catch (error) {
      setLoginIsLoading(false)
      setLoginError("Something went wrong. Is the server running?")
    }
  }

  const updateUser = useCallback((updates) => {
    setLoggedInUser(prevUser => {
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user: loggedInUser,
      token,
      login: onLogin,
      logout: onLogout,
      updateUser,
      isAuthenticated,
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

export default Container;
