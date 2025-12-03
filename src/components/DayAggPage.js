import React, { useEffect, useCallback, useState } from "react"
import { useSwipeable } from "react-swipeable"
import DayScoreTable from "./DayScoreTable"

const DayAggPage = ({ loggedInUser, data, dayIndex, setDayIndex, selectedRecordDate, clearSelectedRecordDate }) => {
  const [swipeDirection, setSwipeDirection] = useState(null)

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

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (dayIndex < data.length - 1) {
        setSwipeDirection('left')
        setDayIndex(dayIndex + 1)
      }
    },
    onSwipedRight: () => {
      if (dayIndex > 0) {
        setSwipeDirection('right')
        setDayIndex(dayIndex - 1)
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: false,
  })

  // Reset swipe direction after animation
  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => setSwipeDirection(null), 300)
      return () => clearTimeout(timer)
    }
  }, [swipeDirection])

  return (
    <div {...handlers} id="dayAggPage" className="page">
      <DayScoreTable
        loggedInUser={loggedInUser}
        dayData={data}
        dayIndex={dayIndex}
        setDayIndex={setDayIndex}
        selectedRecordDate={selectedRecordDate}
        clearSelectedRecordDate={clearSelectedRecordDate}
        swipeDirection={swipeDirection}
      />
    </div>
  )
}

export default DayAggPage