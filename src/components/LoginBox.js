import PropTypes from "prop-types"
import React, { useState } from "react"
import SpinningLoader from "./SpinningLoader"
import api from "../utilities/api"

const LoginBox = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [forename, setForename] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async () => {
    setError(null)
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
          onLogin(username, password, setIsLoading)
        } else {
          setError(data.error)
          setIsLoading(false)
        }
      } catch (err) {
        setError(err.response?.data?.error || "Registration failed")
        setIsLoading(false)
      }
    } else {
      onLogin(username, password, setIsLoading)
    }
  }

  return (
    <div id="loginBox">
      <h2 style={{ marginTop: 0, color: 'var(--blue-1)' }}>
        {isRegistering ? 'Create Account' : 'Login'}
      </h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form method="post" onSubmit={(e) => e.preventDefault()}>
        <div className="loginBoxField">
          <label>Username</label>
          <input type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? onSubmit() : ""} />
        </div>

        {isRegistering && (
          <div className="loginBoxField">
            <label>Display Name</label>
            <input type="text"
              autoComplete="name"
              value={forename}
              onChange={(e) => setForename(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" ? onSubmit() : ""}
              placeholder="e.g. Will" />
          </div>
        )}

        <div className="loginBoxField">
          <label>Password</label>
          <input type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? onSubmit() : ""} />
        </div>

        <button id="loginButton" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <SpinningLoader /> : (isRegistering ? "Sign Up" : "Login")}
        </button>

        <div style={{ marginTop: '15px', fontSize: '0.9em' }}>
          {isRegistering ? "Already have an account? " : "New here? "}
          <span
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError(null)
            }}
            style={{
              color: 'var(--blue-1)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
          >
            {isRegistering ? "Login" : "Create Account"}
          </span>
        </div>
      </form>
    </div>
  )
}

LoginBox.propTypes = {
  onLogin: PropTypes.func
}

export default LoginBox