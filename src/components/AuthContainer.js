import React from "react"
import AuthBox from "./AuthBox"

const AuthContainer = ({onLogin}) => {
  return (
    <div id="authContainer">
      <AuthBox onLogin={onLogin} />
    </div>
  )
}

export default AuthContainer