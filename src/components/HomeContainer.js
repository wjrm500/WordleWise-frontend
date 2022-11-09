import DayAggPage from './DayAggPage'
import WeekAggPage from './WeekAggPage'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import ServerAddrContext from '../contexts/ServerAddrContext';
import SpinningLoader from './SpinningLoader';

const HomeContainer = ({ loggedInUser }) => {
  const SERVER_ADDR = useContext(ServerAddrContext)

  const [appData, setAppData] = useState({})
  const [dataLoaded, setDataLoaded] = useState(false)
  const getData = () => {
    axios.get(SERVER_ADDR + "/getData", {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem('token')
      }
    }).then(({ data }) => {
      setAppData(data)
      setDataLoaded(true)
    })
  }
  useEffect(getData, [appData.length])
  const addScore = (date, user, score) => {
    fetch(SERVER_ADDR + "/addScore", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer " + sessionStorage.getItem('token'),
        "Content-Type": "application/json"
      },
      type: "cors",
      body: JSON.stringify({date, user, score})
    })
      .then(getData)
  }

  const DAILY_PAGE = 'daily'
  const WEEKLY_PAGE = 'weekly'
  const [page, setPage] = useState(DAILY_PAGE)
  const onClick = (page) => setPage(page)
  return (
    <div id="homeContainer">
      <div id="pageMenu">
        <div className={"pageMenuItem " + (page == DAILY_PAGE ? 'selected' : '')} onClick={() => onClick(DAILY_PAGE)}>
          Daily
        </div>
        <div className={"pageMenuItem " + (page == WEEKLY_PAGE ? 'selected' : '')} onClick={() => onClick(WEEKLY_PAGE)}>
          Weekly
        </div>
      </div>
      <div id="homeContainerPage">
        {
          dataLoaded ? (
            page == DAILY_PAGE ?
            <DayAggPage loggedInUser={loggedInUser} addScore={addScore} data={appData} /> :
            <WeekAggPage data={appData} />
          ) : (
            <div className="page">
              <SpinningLoader />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default HomeContainer