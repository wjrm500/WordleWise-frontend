import DayAggPage from "./DayAggPage"
import WeekAggPage from "./WeekAggPage"
import React, { useContext, useEffect, useState } from "react"
import PageConstsContext from "../contexts/PageConstsContext";
import SpinningLoader from "./SpinningLoader";

import PageMenu from "./PageMenu";
import RecordPage from "./RecordPage";

const HomeContainer = ({loggedInUser, appData, getData, addScore}) => {
  /* Hooks */
  const {DAILY_PAGE, WEEKLY_PAGE, RECORD_PAGE} = useContext(PageConstsContext)
  const [pageType, setPageType] = useState(DAILY_PAGE)

  /* Get data */
  useEffect(getData, [appData.length])

  let page
  switch (pageType) {
    case DAILY_PAGE:
      page = <DayAggPage loggedInUser={loggedInUser} addScore={addScore} data={appData} />
      break
    case WEEKLY_PAGE:
      page = <WeekAggPage data={appData} />
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