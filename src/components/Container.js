import Header from './Header'
import React from 'react'
import LoginContainer from './LoginContainer'
import HomeContainer from './HomeContainer'

const Container = ({ loggedInUser, onLogin, onLogout }) => {
  return (
    <div id="container">
      <Header loggedInUser={loggedInUser} onLogout={onLogout} />
      {
        sessionStorage.getItem('token') ?
        <HomeContainer loggedInUser={loggedInUser} /> :
        <LoginContainer onLogin={onLogin} />
      }
    </div>
  )
}

export default Container