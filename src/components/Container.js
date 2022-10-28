import Header from './Header'
import React from 'react'
import LoginContainer from './LoginContainer'
import HomeContainer from './HomeContainer'

const Container = ({ loggedInUser, onLogin, onLogout, addScore, cwData, cwIndex, setCwIndex }) => {
  return (
    <div id="container">
      <Header loggedInUser={loggedInUser} onLogout={onLogout} />
      {
        loggedInUser ?
        <HomeContainer loggedInUser={loggedInUser} addScore={addScore} cwData={cwData} cwIndex={cwIndex} setCwIndex={setCwIndex} /> :
        <LoginContainer onLogin={onLogin} />
      }
    </div>
  )
}

export default Container