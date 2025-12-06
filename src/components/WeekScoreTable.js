import React, { useContext } from "react"
import ScopeContext from "../contexts/ScopeContext"
import { beautifyDate } from "../utilities/dates"

// Helper function to calculate a member's total score for a given week
const calculateMemberWeekTotal = (member, week) => {
  let weekTotal = 0
  const groupCreatedAt = week.group_created_at || null

  if (week.data) {
    Object.entries(week.data).forEach(([dateStr, dayScores]) => {
      // Skip days before group creation
      if (groupCreatedAt && dateStr < groupCreatedAt) {
        return
      }

      const score = dayScores[member.username]
      const dayDate = new Date(dateStr)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (score !== undefined) {
        weekTotal += score
      } else if (dayDate < today) {
        // Past day with no score = 8 (failed)
        weekTotal += 8
      }
      // Future days with no score = 0 (not counted)
    })
  } else {
    // Count only days from group creation onwards
    if (groupCreatedAt) {
      const weekStart = new Date(week.start_of_week)
      const createdDate = new Date(groupCreatedAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(weekStart)
        currentDay.setDate(weekStart.getDate() + i)
        if (currentDay >= createdDate && currentDay < today) {
          weekTotal += 8
        }
      }
    } else {
      weekTotal = 8 * 7
    }
  }

  return weekTotal
}

const WeekScoreTable = ({ weekData, onWeekRowClick }) => {
  const { scopeMembers, isPersonalScope } = useContext(ScopeContext)

  const headerRow = (
    <tr>
      <th>#</th>
      <th>Week starting</th>
      {scopeMembers.map((member, index) => (
        <th
          key={member.username}
          className={index === 0 && scopeMembers.length > 2 ? 'loggedInUserColumn' : ''}
        >
          {isPersonalScope ? 'Score' : (member.forename || member.username)}
        </th>
      ))}
    </tr>
  )

  const dataRows = weekData.map(week => {
    const memberTotals = {}
    let minTotal = Infinity

    scopeMembers.forEach(member => {
      const memberTotal = calculateMemberWeekTotal(member, week)
      memberTotals[member.username] = memberTotal
      if (memberTotal < minTotal) minTotal = memberTotal
    })

    const isTie = Object.values(memberTotals).filter(t => t === minTotal).length > 1
    const hasMultiplePlayers = scopeMembers.length > 1

    return (
      <tr key={week.start_of_week} onClick={() => onWeekRowClick(week.index)} className="clickableRow">
        <td>{week.index + 1}</td>
        {/* Use includeDay=false, includeYear=true for Weekly: "Nov 24, 2025" */}
        <td>{beautifyDate(week.start_of_week, false, true)}</td>
        {scopeMembers.map((member, index) => {
          const total = memberTotals[member.username]
          const isWinner = hasMultiplePlayers && total === minTotal && !isTie
          const className = `scoreColumn ${isWinner ? 'winner' : ''} ${index === 0 && scopeMembers.length > 2 ? 'loggedInUserColumn' : ''}`
          return (
            <td
              key={member.username}
              className={className}
            >
              {total}
            </td>
          )
        })}
      </tr>
    )
  })

  // Grand totals (respecting group_created_at per week)
  const grandTotals = {}
  scopeMembers.forEach(member => {
    grandTotals[member.username] = weekData.reduce((acc, week) => {
      return acc + calculateMemberWeekTotal(member, week)
    }, 0)
  })

  const summaryRow = (
    <tr style={{ backgroundColor: "var(--blue-3)", color: "white" }}>
      <td></td>
      <td></td>
      {scopeMembers.map((member, index) => (
        <td
          key={member.username}
          className={`scoreColumn ${index === 0 && scopeMembers.length > 2 ? 'loggedInUserColumn' : ''}`}
        >
          {grandTotals[member.username]}
        </td>
      ))}
    </tr>
  )

  return (
    <div style={{ width: "100%" }}>
      <div className="tableContainer" style={{ height: "200px" }}>
        <table className="scoreTable table">
          <thead>
            {headerRow}
          </thead>
          <tbody>
            {dataRows}
          </tbody>
        </table>
      </div>
      <div className="tableContainer" style={{ marginTop: "5px" }}>
        <table className="scoreTable table">
          <tbody>
            {summaryRow}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WeekScoreTable;
