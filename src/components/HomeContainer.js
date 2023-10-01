import DayAggPage from "./DayAggPage"
import WeekAggPage from "./WeekAggPage"
import React, { useContext, useEffect, useState } from "react"
import PageConstsContext from "../contexts/PageConstsContext";
import SpinningLoader from "./SpinningLoader";

import PageMenu from "./PageMenu";
import RecordPage from "./RecordPage";

const HomeContainer = ({loggedInUser, appData, getData, addScore, dayIndex, setDayIndex}) => {
  /* Hooks */
  const {DAILY_PAGE, WEEKLY_PAGE, RECORD_PAGE} = useContext(PageConstsContext)
  const [pageType, setPageType] = useState(DAILY_PAGE)

  const onWeekRowClick = (index) => {
    setPageType(DAILY_PAGE)
    setDayIndex(index)
  }

  /* Get data */
  useEffect(getData, [appData.length])

  let page
  switch (pageType) {
    case DAILY_PAGE:
      page = <DayAggPage loggedInUser={loggedInUser} addScore={addScore} data={appData} dayIndex={dayIndex} setDayIndex={setDayIndex} />
      break
    case WEEKLY_PAGE:
      page = <WeekAggPage data={appData} onWeekRowClick={onWeekRowClick} />
      break
    case RECORD_PAGE:
      page = <RecordPage data={appData} />
      break
  }
  
  /* Render */
  return (
    <div id="homeContainer">
      <PageMenu pageType={pageType} setPageType={setPageType} />
      {
        appData.length > 0 ?
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