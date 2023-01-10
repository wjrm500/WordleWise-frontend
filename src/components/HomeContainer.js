import DayAggPage from "./DayAggPage"
import WeekAggPage from "./WeekAggPage"
import React, { useContext, useEffect, useState } from "react"
import axios from "axios";
import PageConstsContext from "../contexts/PageConstsContext";
import ServerAddrContext from "../contexts/ServerAddrContext";
import SpinningLoader from "./SpinningLoader";
import StatusCodes from "http-status-codes";
import PageMenu from "./PageMenu";
import RecordPage from "./RecordPage";

const HomeContainer = ({loggedInUser, onLogout}) => {
  /* Hooks */
  const SERVER_ADDR = useContext(ServerAddrContext)
  const {DAILY_PAGE, WEEKLY_PAGE, RECORD_PAGE} = useContext(PageConstsContext)
  const [appData, setAppData] = useState({})
  const [pageType, setPageType] = useState(DAILY_PAGE)
  
  const postOptions = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    type: "cors"
  }

  /* Functions */
  const getData = () => {
    axios.post(
      SERVER_ADDR + "/getData",
      {timezone: Intl.DateTimeFormat().resolvedOptions().timeZone},
      postOptions
    ).then(({data}) => {
      setAppData(data)
    }).catch(({response}) => {
      if (response.status == StatusCodes.UNAUTHORIZED) {
        onLogout()
      }
    })
  }
  const addScore = (date, user, score) => {
    axios.post(
      SERVER_ADDR + "/addScore",
      {date, user, score, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone},
      postOptions
    ).then(getData)
  }

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