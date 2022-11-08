import Header from './Header'
import React from 'react'
import LoginContainer from './LoginContainer'
import HomeContainer from './HomeContainer'

const Container = ({ loggedInUser, onLogin, onLogout, addScore, dayData, dayMaxIndex, setDayMaxIndex, weekData, weekMaxIndex, setWeekMaxIndex }) => {
  return (
    <div id="container">
      <Header loggedInUser={loggedInUser} onLogout={onLogout} />
      {
        sessionStorage.getItem('token') ?
        <HomeContainer loggedInUser={loggedInUser} addScore={addScore} dayData={dayData} dayMaxIndex={dayMaxIndex} setDayMaxIndex={setDayMaxIndex} weekData={weekData} weekMaxIndex={weekMaxIndex} setWeekMaxIndex={setWeekMaxIndex} /> :
        <LoginContainer onLogin={onLogin} />
      }
    </div>
  )
}

export default Container