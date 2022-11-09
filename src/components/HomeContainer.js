import DayAggPage from "./DayAggPage"
import WeekAggPage from "./WeekAggPage"
import React, { useContext, useEffect, useState } from "react"
import axios from "axios";
import ServerAddrContext from "../contexts/ServerAddrContext";
import SpinningLoader from "./SpinningLoader";
import StatusCodes from "http-status-codes";

const HomeContainer = ({ loggedInUser, onLogout }) => {
  const DAILY_PAGE = "daily"
  const WEEKLY_PAGE = "weekly"

  /* Hooks */
  const SERVER_ADDR = useContext(ServerAddrContext)
  const [appData, setAppData] = useState({})
  const [page, setPage] = useState(DAILY_PAGE)
  
  /* Functions */
  const getData = () => {
    axios.get(SERVER_ADDR + "/getData", {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      },
      type: "cors"
    }).then(({ data }) => {
      setAppData(data)
    }).catch(({ response }) => {
      if (response.status == StatusCodes.UNAUTHORIZED) {
        onLogout()
      }
    })
  }
  const addScore = (date, user, score) => {
    axios.post(
      SERVER_ADDR + "/addScore",
      {date, user, score},
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Authorization": "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        type: "cors"
      }
    ).then(getData)
  }
  const onClick = (page) => setPage(page)

  /* Get data */
  useEffect(getData, [appData.length])
  
  /* Render */
  return (
    <div id="homeContainer">
      <div id="pageMenu">
        <div className={"pageMenuItem " + (page == DAILY_PAGE ? "selected" : "")} onClick={() => onClick(DAILY_PAGE)}>
          Daily
        </div>
        <div className={"pageMenuItem " + (page == WEEKLY_PAGE ? "selected" : "")} onClick={() => onClick(WEEKLY_PAGE)}>
          Weekly
        </div>
      </div>
      <div id="homeContainerPage">
        {
          appData.length > 0 ? (
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