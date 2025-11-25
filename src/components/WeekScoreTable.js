import React, { useContext } from "react"
import ScopeContext from "../contexts/ScopeContext"

const WeekScoreTable = ({ weekData, onWeekRowClick }) => {
  const { scopeMembers } = useContext(ScopeContext)

  const headerRow = (
    <tr>
      <th>#</th>
      <th>Week starting</th>
      {scopeMembers.map(member => (
        <th key={member.username}>{member.forename || member.username}</th>
      ))}
    </tr>
  )

  const dataRows = weekData.map(week => {
    const memberTotals = {}
    let minTotal = Infinity
    const groupCreatedAt = week.group_created_at || null

    scopeMembers.forEach(member => {
      let memberTotal = 0
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
            memberTotal += score
          } else if (dayDate < today) {
            // Past day with no score = 8 (failed)
            memberTotal += 8
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
              memberTotal += 8
            }
          }
        } else {
          memberTotal = 8 * 7
        }
      }

      memberTotals[member.username] = memberTotal
      if (memberTotal < minTotal) minTotal = memberTotal
    })

    const isTie = Object.values(memberTotals).filter(t => t === minTotal).length > 1

    return (
      <tr key={week.start_of_week} onClick={() => onWeekRowClick(week.index)} className="clickableRow">
        <td>{week.index + 1}</td>
        <td>{week.start_of_week}</td>
        {scopeMembers.map(member => {
          const total = memberTotals[member.username]
          const isWinner = total === minTotal
          const style = isWinner && !isTie ? { color: 'green', fontWeight: 'bold' } : {}
          return <td key={member.username} className="scoreColumn" style={style}>{total}</td>
        })}
      </tr>
    )
  })

  // Grand totals (respecting group_created_at per week)
  const grandTotals = {}
  scopeMembers.forEach(member => {
    grandTotals[member.username] = weekData.reduce((acc, week) => {
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
            weekTotal += 8
          }
        })
      } else {
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
      return acc + weekTotal
    }, 0)
  })

  const summaryRow = (
    <tr style={{ backgroundColor: "var(--blue-3)", color: "white" }}>
      <td></td>
      <td></td>
      {scopeMembers.map(member => (
        <td key={member.username} className="scoreColumn">{grandTotals[member.username]}</td>
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

export default WeekScoreTable