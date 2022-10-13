import Header from './Header'
import React from 'react'

const Container = ({ loggedIn }) => {
  return (
    <div id="container">
      <Header loggedIn={loggedIn} />
    </div>
  )
}

export default Container