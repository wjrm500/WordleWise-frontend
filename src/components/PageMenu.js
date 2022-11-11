import React, { useContext } from 'react'
import PageConstsContext from '../contexts/PageConstsContext'

const PageMenu = ({ page, setPage }) => {
  const {DAILY_PAGE, WEEKLY_PAGE} = useContext(PageConstsContext)
  const onClick = (page) => setPage(page)
  return (
    <div id="pageMenu">
      <div className={"pageMenuItem " + (page == DAILY_PAGE ? "selected" : "")} onClick={() => onClick(DAILY_PAGE)}>
          Daily
      </div>
      <div className={"pageMenuItem " + (page == WEEKLY_PAGE ? "selected" : "")} onClick={() => onClick(WEEKLY_PAGE)}>
          Weekly
      </div>
    </div>
  )
}

export default PageMenu