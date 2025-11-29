import DayAggPage from "./DayAggPage"
import WeekAggPage from "./WeekAggPage"
import RecordPage from "./RecordPage"
import ChartPage from "./ChartPage"
import React, { useContext, useEffect, useState, useMemo } from "react"
import PageConstsContext from "../contexts/PageConstsContext"
import ScopeContext from "../contexts/ScopeContext"
import SpinningLoader from "./SpinningLoader"
import PageMenu from "./PageMenu"

const HomeContainer = ({ loggedInUser, currentWeekStart, setCurrentWeekStart }) => {
  const { DAILY_PAGE, WEEKLY_PAGE, RECORD_PAGE, CHART_PAGE } = useContext(PageConstsContext)
  const { scores, isScoresLoading } = useContext(ScopeContext)
  const [pageType, setPageType] = useState(DAILY_PAGE)
  const [selectedRecordDate, setSelectedRecordDate] = useState(null)

  // Convert week start date to index
  const dayIndex = useMemo(() => {
    if (!scores || scores.length === 0) return null
    if (!currentWeekStart) return scores.length - 1
    
    const index = scores.findIndex(week => week.start_of_week === currentWeekStart)
    if (index === -1) {
      return scores.length - 1
    }
    return index
  }, [scores, currentWeekStart])

  // Update week start when navigating
  const setDayIndex = (newIndex) => {
    if (scores && scores[newIndex]) {
      setCurrentWeekStart(scores[newIndex].start_of_week)
    }
  }

  const onWeekRowClick = (index) => {
    setPageType(DAILY_PAGE)
    setDayIndex(index)
  }

  const onRecordClick = (streak) => {
    setSelectedRecordDate(streak.periodEnd)
    const weekIndex = scores.findIndex(week =>
      week.data.hasOwnProperty(streak.periodEnd)
    )
    if (weekIndex !== -1) {
      setPageType(DAILY_PAGE)
      setDayIndex(weekIndex)
    }
  }

  // Initialize to current week if not set
  useEffect(() => {
    if (scores && scores.length > 0 && !currentWeekStart) {
      setCurrentWeekStart(scores[scores.length - 1].start_of_week)
    }
  }, [scores, currentWeekStart, setCurrentWeekStart])

  let page
  switch (pageType) {
    case DAILY_PAGE:
      page = <DayAggPage loggedInUser={loggedInUser} data={scores} dayIndex={dayIndex} setDayIndex={setDayIndex} selectedRecordDate={selectedRecordDate} />
      break
    case WEEKLY_PAGE:
      page = <WeekAggPage data={scores} onWeekRowClick={onWeekRowClick} />
      break
    case RECORD_PAGE:
      page = <RecordPage data={scores} onRecordClick={onRecordClick} />
      break
    case CHART_PAGE:
      page = <ChartPage scores={scores} loggedInUser={loggedInUser} />
      break
    default:
      page = null
  }

  // Show loader if scores are loading OR if scores are null/empty
  const isReady = !isScoresLoading && scores && scores.length > 0 && dayIndex !== null

  return (
    <div id="homeContainer">
      <PageMenu pageType={pageType} setPageType={setPageType} />
      {
        isReady ? page : (
          <div className="page">
            <SpinningLoader />
          </div>
        )
      }
    </div>
  )
}

export default HomeContainer