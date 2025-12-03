import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import SpinningLoader from "./SpinningLoader"
import ErrorMessage from "./common/ErrorMessage"
import api from "../utilities/api"

const AuthBox = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [forename, setForename] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  // Check for session expiry message on mount
  useEffect(() => {
    if (sessionStorage.getItem('session_expired') === 'true') {
      setSessionExpired(true)
      sessionStorage.removeItem('session_expired')
    }
  }, [])

  const onSubmit = async () => {
    setError(null)
    setSessionExpired(false)
    if (username === "" || password === "") {
      setError("Please enter both a username and a password")
      return
    }
    if (isRegistering && forename === "") {
      setError("Please enter a display name")
      return
    }

    setIsLoading(true)

    if (isRegistering) {
      try {
        const { data } = await api.post("/register", { username, password, forename })
        if (data.success) {
          onLogin(username, password, setIsLoading, setError)
        } else {
          setError(data.error)
          setIsLoading(false)
        }
      } catch (err) {
        setError(err.response?.data?.error || "Registration failed")
        setIsLoading(false)
      }
    } else {
      onLogin(username, password, setIsLoading, setError)
    }
  }

  return (
    <div id="authBox">
      <h2 style={{ marginTop: 0 }}>
        {isRegistering ? 'Create account' : 'Login'}
      </h2>

      {sessionExpired && (
        <div className="session-expired-message">
          Your session has expired. Please log in again.
        </div>
      )}

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      <form method="post" onSubmit={(e) => e.preventDefault()}>
        <div className="authBoxField">
          <label>Username</label>
          <input type="text"
            autoComplete="username"
            value={username}
            maxLength={12}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? onSubmit() : ""} />
        </div>

        {isRegistering && (
          <div className="authBoxField">
            <label>Display name</label>
            <input type="text"
              autoComplete="name"
              value={forename}
              maxLength={10}
              onChange={(e) => setForename(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" ? onSubmit() : ""}
              placeholder="e.g. Will" />
          </div>
        )}

        <div className="authBoxField">
          <label>Password</label>
          <input type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? onSubmit() : ""} />
        </div>

        <button id="loginButton" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <SpinningLoader /> : (isRegistering ? "Sign up" : "Login")}
        </button>

        <div className="auth-switch-text">
          {isRegistering ? "Already have an account? " : "New here? "}
          <span
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError(null)
              setSessionExpired(false)
            }}
            className="auth-switch-link"
          >
            {isRegistering ? "Login" : "Create account"}
          </span>
        </div>
      </form>
    </div>
  )
}

AuthBox.propTypes = {
  onLogin: PropTypes.func
}

export default AuthBox;
