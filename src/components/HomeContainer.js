import CurrentWeekPage from './CurrentWeekPage'
import HistoryPage from './HistoryPage'
import React, { useState } from 'react'

const HomeContainer = ({ cwData, cwIndex, setCwIndex }) => {
  const CURRENT_WEEK_PAGE = 'cwp'
  const HISTORY_PAGE = 'hp'
  const [page, setPage] = useState(CURRENT_WEEK_PAGE)
  const onClick = (page) => setPage(page)
  return (
    <div id="homeContainer">
      <div id="pageMenu">
        {/* Would be good to dynamically iterate through pages */}
        <div className={"pageMenuItem " + (page == CURRENT_WEEK_PAGE ? 'selected' : '')} onClick={() => onClick(CURRENT_WEEK_PAGE)}>
          Current Week
        </div>
        <div className={"pageMenuItem " + (page == HISTORY_PAGE ? 'selected' : '')} onClick={() => onClick(HISTORY_PAGE)}>
          History
        </div>
      </div>
      <div id="homeContainerPage">
        {
          page == CURRENT_WEEK_PAGE ?
          <CurrentWeekPage cwData={cwData} cwIndex={cwIndex} setCwIndex={setCwIndex} /> :
          <HistoryPage />
        }
      </div>
    </div>
  )
}

export default HomeContainer