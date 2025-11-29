import React from "react"
import AuthBox from "./AuthBox"

const LoginContainer = ({onLogin}) => {
  return (
    <div id="loginContainer">
      <AuthBox onLogin={onLogin} />
    </div>
  )
}

export default LoginContainer