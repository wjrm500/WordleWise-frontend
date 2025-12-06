import React from "react"
import AuthBox from "./AuthBox"
import logo from '../images/logo.png'

const AuthContainer = ({onLogin}) => {
  return (
    <div id="authContainer">
      <img src={logo} alt="WordleWise Logo" className="auth-logo" />
      <AuthBox onLogin={onLogin} />
    </div>
  )
}

export default AuthContainer