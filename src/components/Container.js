import Header from './Header'
import React from 'react'
import Main from './Main'

const Container = ({ loggedIn, onLogin }) => {
  return (
    <div id="container">
      <Header loggedIn={loggedIn} />
      <Main onLogin={onLogin} />
    </div>
  )
}

export default Container