import React, { useContext } from 'react'
import PageConstsContext from '../contexts/PageConstsContext'

const PageMenu = ({ pageType, setPageType }) => {
  const { DAILY_PAGE, WEEKLY_PAGE, RECORD_PAGE, CHART_PAGE } = useContext(PageConstsContext);
  const onClick = (pageType) => setPageType(pageType)
  return (
    <div id="pageMenu">
      <div className={"pageMenuItem " + (pageType == DAILY_PAGE ? "selected" : "")} onClick={() => onClick(DAILY_PAGE)}>
        Daily
      </div>
      <div className={"pageMenuItem " + (pageType == WEEKLY_PAGE ? "selected" : "")} onClick={() => onClick(WEEKLY_PAGE)}>
        Weekly
      </div>
      <div className={"pageMenuItem " + (pageType == RECORD_PAGE ? "selected" : "")} onClick={() => onClick(RECORD_PAGE)}>
        Records
      </div>
      <div className={"pageMenuItem " + (pageType == CHART_PAGE ? "selected" : "")} onClick={() => onClick(CHART_PAGE)}>
        Chart
      </div>
    </div>
  )
}

export default PageMenu