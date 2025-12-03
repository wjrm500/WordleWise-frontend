import React, { useEffect, useState, useContext } from "react"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { calculateTotal } from "../utilities/arrays"
import { beautifyDate, PAST, PRESENT, FUTURE, isPastPresentOrFuture } from "../utilities/dates"
import ScopeContext from "../contexts/ScopeContext"
import ModalOverlay from "./ModalOverlay"
import AddScoreModal from "./AddScoreModal"

const DayScoreTable = ({ loggedInUser, dayData, dayIndex, setDayIndex, selectedRecordDate }) => {
  const [highlightDate, setHighlightDate] = useState(null)
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false)
  const { scopeMembers } = useContext(ScopeContext)

  useEffect(() => {
    if (selectedRecordDate != null) {
      setHighlightDate(selectedRecordDate)
      setTimeout(() => setHighlightDate(null), 1000)
    }
  }, [selectedRecordDate])

  // Guard against undefined/null data
  if (!dayData || dayIndex === null || !dayData[dayIndex]) {
    return null
  }

  const weekData = dayData[dayIndex]
  const groupCreatedAt = weekData.group_created_at || null

  const canGoBack = dayIndex > 0
  const canGoForward = dayIndex < dayData.length - 1

  const handlePrev = () => {
    if (canGoBack) setDayIndex(dayIndex - 1)
  }

  const handleNext = () => {
    if (canGoForward) setDayIndex(dayIndex + 1)
  }

  // Use includeDay=false, includeYear=true for the week header
  const title = beautifyDate(weekData["start_of_week"], false, true)

  const headerRow1 = (
    <tr>
      <th colSpan={scopeMembers.length + 1} className="weekHeader">
        <div className="weekHeaderContent">
          <button
            className={`weekArrow ${!canGoBack ? 'disabled' : ''}`}
            onClick={handlePrev}
            disabled={!canGoBack}
          >
            <FaChevronLeft />
          </button>
          <span>Week starting {title}</span>
          <button
            className={`weekArrow ${!canGoForward ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!canGoForward}
          >
            <FaChevronRight />
          </button>
        </div>
      </th>
    </tr>
  )

  const headerRow2 = (
    <tr>
      <th>Date</th>
      {scopeMembers.map((member, index) => (
        <th
          key={member.username}
          className={`scoreColumn ${index === 0 && scopeMembers.length > 2 ? 'loggedInUserColumn' : ''}`}
        >
          {member.forename || member.username}
        </th>
      ))}
    </tr>
  )

  // Track hidden status for each member (for spoiler protection)
  const memberHiddenStatus = {}
  scopeMembers.forEach(m => memberHiddenStatus[m.username] = false)

  // Check if logged in user has played today (for spoiler protection)
  const todayStr = new Date().toISOString().slice(0, 10)
  const todayData = weekData["data"][todayStr] || {}
  const loggedInUserPlayedToday = todayData[loggedInUser.username] != null

  let dataRows = []
  for (let date in weekData["data"]) {
    const day = weekData["data"][date]
    const pastPresentFuture = isPastPresentOrFuture(date)
    const isToday = date === todayStr
    const isBeforeGroupCreation = groupCreatedAt && date < groupCreatedAt

    const memberCells = scopeMembers.map((member, index) => {
      const isCurrentUser = member.username === loggedInUser.username
      const score = day[member.username]
      const className = `scoreColumn ${index === 0 && scopeMembers.length > 2 ? 'loggedInUserColumn' : ''}`

      // Future days - empty
      if (pastPresentFuture === FUTURE) {
        return <td key={member.username} className={className}></td>
      }

      // Days before group creation - show as N/A (dash)
      if (isBeforeGroupCreation) {
        return <td key={member.username} className={className} style={{ color: '#999' }}>-</td>
      }

      if (isCurrentUser) {
        // Current user's cell
        if (pastPresentFuture === PRESENT && score == null) {
          return (
            <td key={member.username} className={className}>
              <button
                className="quickAddButton"
                onClick={() => setIsQuickAddModalOpen(true)}
                title="Add score for today"
              >
                +
              </button>
            </td>
          )
        }
        const displayScore = score || (pastPresentFuture === PAST ? 8 : "")
        const style = score == null && pastPresentFuture === PAST ? { color: "darkgrey" } : {}
        return <td key={member.username} className={className} style={style}>{displayScore}</td>
      } else {
        // Other users - spoiler protection for today only
        if (isToday && !loggedInUserPlayedToday) {
          if (score != null) {
            memberHiddenStatus[member.username] = true
            return <td key={member.username} className={className}>?</td>
          } else {
            return <td key={member.username} className={className}>-</td>
          }
        } else {
          const displayScore = score || (pastPresentFuture === PAST ? 8 : "")
          const style = score == null && pastPresentFuture === PAST ? { color: "darkgrey" } : {}
          return <td key={member.username} className={className} style={style}>{displayScore}</td>
        }
      }
    })

    const row = (
      <tr key={date}>
        {/* Use includeDay=true, includeYear=false for daily rows: "Mon, Nov 24" */}
        <td>{beautifyDate(date, true, false)}</td>
        {memberCells}
      </tr>
    )
    dataRows.push(row)
  }

  dataRows = dataRows.map(row => {
    const isHighlighted = highlightDate && row.key === highlightDate
    return (
      <tr key={row.key} className={isHighlighted ? 'highlightedRow' : ''}>
        {row.props.children}
      </tr>
    )
  })

  // Calculate totals (respecting group_created_at)
  const summaryCells = scopeMembers.map((member, index) => {
    const className = `scoreColumn ${index === 0 && scopeMembers.length > 2 ? 'loggedInUserColumn' : ''}`
    if (memberHiddenStatus[member.username]) {
      return <td key={member.username} className={className}>?</td>
    }
    const total = calculateTotal(weekData["data"], member.username, groupCreatedAt)
    return <td key={member.username} className={className}>{total}</td>
  })

  const summaryRow = (
    <tr className="summaryRow">
      <td></td>
      {summaryCells}
    </tr>
  )

  return (
    <div className="dayScoreTableWrapper">
      <table id="dayScoreTable" className="scoreTable table">
        <thead>
          {headerRow1}
          {headerRow2}
        </thead>
        <tbody>
          {dataRows}
        </tbody>
      </table>
      <table className="scoreTable table summaryTable">
        <tbody>
          {summaryRow}
        </tbody>
      </table>
      {isQuickAddModalOpen && (
        <>
          <ModalOverlay onClick={() => setIsQuickAddModalOpen(false)} />
          <AddScoreModal
            onClose={() => setIsQuickAddModalOpen(false)}
            quickAdd={true}
            presetDate={todayStr}
          />
        </>
      )}
    </div>
  )
}

export default DayScoreTable