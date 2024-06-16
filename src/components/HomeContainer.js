import DayAggPage from "./DayAggPage"
import WeekAggPage from "./WeekAggPage"
import RecordPage from "./RecordPage"
import StatsPage from "./StatsPage"
import React, { useContext, useEffect, useState } from "react"
import PageConstsContext from "../contexts/PageConstsContext"
import SpinningLoader from "./SpinningLoader"
import PageMenu from "./PageMenu"

const HomeContainer = ({ loggedInUser, scores, getScores, addScore, getUsers, users, dayIndex, setDayIndex }) => {
  /* Hooks */
  const { DAILY_PAGE, WEEKLY_PAGE, RECORD_PAGE, STATS_PAGE } = useContext(PageConstsContext)
  const [pageType, setPageType] = useState(DAILY_PAGE)
  const [selectedRecordDate, setSelectedRecordDate] = useState(null)

  const onWeekRowClick = (index) => {
    setPageType(DAILY_PAGE)
    setDayIndex(index)
  }

  const onRecordClick = (streak) => {
    setSelectedRecordDate(streak.endDate)
    const weekIndex = scores.findIndex(week =>
      week.data.hasOwnProperty(streak.endDate)
    )
    setPageType(DAILY_PAGE)
    setDayIndex(weekIndex)
  }

  /* Get score data */
  useEffect(getScores, [])

  /* Get user data */
  useEffect(getUsers, [])

  let page
  switch (pageType) {
    case DAILY_PAGE:
      page = <DayAggPage loggedInUser={loggedInUser} addScore={addScore} data={scores} dayIndex={dayIndex} setDayIndex={setDayIndex} selectedRecordDate={selectedRecordDate} />
      break
    case WEEKLY_PAGE:
      page = <WeekAggPage data={scores} onWeekRowClick={onWeekRowClick} />
      break
    case RECORD_PAGE:
      page = <RecordPage data={scores} onRecordClick={onRecordClick} />
      break
    case STATS_PAGE:
      page = <StatsPage scores={scores} users={users} loggedInUser={loggedInUser} />
      break
  }

  /* Render */
  return (
    <div id="homeContainer">
      <PageMenu pageType={pageType} setPageType={setPageType} />
      {
        scores.length > 0 ?
          page : (
            <div className="page">
              <SpinningLoader />
            </div>
          )
      }
    </div>
  )
}

export default HomeContainer