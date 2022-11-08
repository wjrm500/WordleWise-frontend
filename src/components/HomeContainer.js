import DayAggPage from './DayAggPage'
import WeekAggPage from './WeekAggPage'
import React, { useState } from 'react'

const HomeContainer = ({ loggedInUser, addScore, dayData, dayMaxIndex, setDayMaxIndex, weekData, weekMaxIndex, setWeekMaxIndex }) => {
  const CURRENT_WEEK_PAGE = 'cwp'
  const HISTORY_PAGE = 'hp'
  const [page, setPage] = useState(CURRENT_WEEK_PAGE)
  const onClick = (page) => setPage(page)
  return (
    <div id="homeContainer">
      <div id="pageMenu">
        {/* Would be good to dynamically iterate through pages */}
        <div className={"pageMenuItem " + (page == CURRENT_WEEK_PAGE ? 'selected' : '')} onClick={() => onClick(CURRENT_WEEK_PAGE)}>
          Daily
        </div>
        <div className={"pageMenuItem " + (page == HISTORY_PAGE ? 'selected' : '')} onClick={() => onClick(HISTORY_PAGE)}>
          Weekly
        </div>
      </div>
      <div id="homeContainerPage">
        {
          page == CURRENT_WEEK_PAGE ?
          <DayAggPage loggedInUser={loggedInUser} addScore={addScore} dayData={dayData} dayMaxIndex={dayMaxIndex} setDayMaxIndex={setDayMaxIndex} /> :
          <WeekAggPage weekData={weekData} weekMaxIndex={weekMaxIndex} setWeekMaxIndex={setWeekMaxIndex} />
        }
      </div>
    </div>
  )
}

export default HomeContainer