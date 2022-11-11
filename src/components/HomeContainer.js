import DayAggPage from "./DayAggPage"
import WeekAggPage from "./WeekAggPage"
import React, { useContext, useEffect, useState } from "react"
import axios from "axios";
import PageConstsContext from "../contexts/PageConstsContext";
import ServerAddrContext from "../contexts/ServerAddrContext";
import SpinningLoader from "./SpinningLoader";
import StatusCodes from "http-status-codes";
import PageMenu from "./PageMenu";

const HomeContainer = ({ loggedInUser, onLogout }) => {
  /* Hooks */
  const SERVER_ADDR = useContext(ServerAddrContext)
  const {DAILY_PAGE} = useContext(PageConstsContext)
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

  /* Get data */
  useEffect(getData, [appData.length])
  
  /* Render */
  return (
    <div id="homeContainer">
      <PageMenu page={page} setPage={setPage} />
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
  )
}

export default HomeContainer