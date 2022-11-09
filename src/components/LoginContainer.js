import React from "react"
import LoginBox from "./LoginBox"

const LoginContainer = ({ onLogin }) => {
  return (
    <div id="loginContainer">
      <LoginBox onLogin={onLogin} />
    </div>
  )
}

export default LoginContainer