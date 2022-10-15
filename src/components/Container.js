import Header from './Header'
import React from 'react'
import LoginContainer from './LoginContainer'
import HomeContainer from './HomeContainer'

const Container = ({ loggedIn, onLogin, onLogout, cwData }) => {
  return (
    <div id="container">
      <Header loggedIn={loggedIn} onLogout={onLogout} />
      {
        loggedIn ?
        <HomeContainer cwData={cwData} /> :
        <LoginContainer onLogin={onLogin} />
      }
      
    </div>
  )
}

export default Container