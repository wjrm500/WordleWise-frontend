import Header from './Header'
import React from 'react'
import LoginContainer from './LoginContainer'
import HomeContainer from './HomeContainer'

const Container = ({ loggedIn, onLogin, onLogout, cwData, cwIndex, setCwIndex }) => {
  return (
    <div id="container">
      <Header loggedIn={loggedIn} onLogout={onLogout} />
      {
        loggedIn ?
        <HomeContainer cwData={cwData} cwIndex={cwIndex} setCwIndex={setCwIndex} /> :
        <LoginContainer onLogin={onLogin} />
      }
      
    </div>
  )
}

export default Container