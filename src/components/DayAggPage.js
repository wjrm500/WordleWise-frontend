import React, { useEffect } from "react"
import DayScoreTable from "./DayScoreTable"

const DayAggPage = ({ loggedInUser, data, dayIndex, setDayIndex, selectedRecordDate }) => {

  const handleKeyPress = (event) => {
    if (event.keyCode === 37 && dayIndex > 0) {
      setDayIndex(dayIndex - 1)
    } else if (event.keyCode === 39 && dayIndex < data.length - 1) {
      setDayIndex(dayIndex + 1)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [dayIndex, data.length, setDayIndex])

  return (
    <div id="dayAggPage" className="page">
      <DayScoreTable
        loggedInUser={loggedInUser}
        dayData={data}
        dayIndex={dayIndex}
        setDayIndex={setDayIndex}
        selectedRecordDate={selectedRecordDate}
      />
    </div>
  )
}

export default DayAggPage