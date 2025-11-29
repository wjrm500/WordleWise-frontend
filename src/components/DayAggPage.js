import React, { useEffect, useCallback } from "react"
import DayScoreTable from "./DayScoreTable"

const DayAggPage = ({ loggedInUser, data, dayIndex, setDayIndex, selectedRecordDate }) => {

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'ArrowLeft' && dayIndex > 0) {
      setDayIndex(dayIndex - 1)
    } else if (event.key === 'ArrowRight' && dayIndex < data.length - 1) {
      setDayIndex(dayIndex + 1)
    }
  }, [dayIndex, data.length, setDayIndex])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

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