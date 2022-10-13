import React from 'react'
import LoginBox from './LoginBox'

const Main = ({ onLogin }) => {
  return (
    <div id="main">
      <LoginBox onLogin={onLogin} />
    </div>
  )
}

export default Main