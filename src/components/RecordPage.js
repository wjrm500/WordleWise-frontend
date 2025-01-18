import React, { useState } from 'react'
import { PRESENT, isPastPresentOrFuture } from '../utilities/dates'
import {
  getUnbeatenStreaks,
  getWinStreaks,
  getXOrBelowStreaks,
  getWeeklyRecords,
  getRollingPeriodRecords,
  getFortnightRecords,
  getMonthlyRecords
} from '../utilities/records'

const RecordPage = ({data, onRecordClick}) => {
  // Existing streak constants
  const CONSECUTIVE_WINS = "consecWin"
  const CONSECUTIVE_DAYS_UNBEATEN = "consecUnbeat"
  const CONSECUTIVE_ONE_BELOW = "consec1"
  const CONSECUTIVE_TWO_BELOW = "consec2"
  const CONSECUTIVE_THREE_BELOW = "consec3"
  const CONSECUTIVE_FOUR_BELOW = "consec4"
  const CONSECUTIVE_FIVE_BELOW = "consec5"
  
  // New period-based record constants
  const WEEKLY_LOW = "weeklyLow"
  const ROLLING_7_LOW = "rolling7Low"
  const FORTNIGHT_LOW = "fortnightLow"
  const ROLLING_14_LOW = "rolling14Low"
  const MONTH_LOW = "monthLow"
  const ROLLING_28_LOW = "rolling28Low"
  
  const [recordType, setRecordType] = useState(CONSECUTIVE_WINS)
  
  const getRecords = (recordType) => {
    switch(recordType) {
      // Existing cases...
      case CONSECUTIVE_WINS:
        return getWinStreaks(data)
      case CONSECUTIVE_DAYS_UNBEATEN:
        return getUnbeatenStreaks(data)
      case CONSECUTIVE_ONE_BELOW:
        return getXOrBelowStreaks(data, 1)
      case CONSECUTIVE_TWO_BELOW:
        return getXOrBelowStreaks(data, 2)
      case CONSECUTIVE_THREE_BELOW:
        return getXOrBelowStreaks(data, 3)
      case CONSECUTIVE_FOUR_BELOW:
        return getXOrBelowStreaks(data, 4)
      case CONSECUTIVE_FIVE_BELOW:
        return getXOrBelowStreaks(data, 5)
      
      // New cases
      case WEEKLY_LOW:
        return getWeeklyRecords(data)
      case ROLLING_7_LOW:
        return getRollingPeriodRecords(data, 7)
      case FORTNIGHT_LOW:
        return getFortnightRecords(data)
      case ROLLING_14_LOW:
        return getRollingPeriodRecords(data, 14)
      case MONTH_LOW:
        return getMonthlyRecords(data)
      case ROLLING_28_LOW:
        return getRollingPeriodRecords(data, 28)
    }
  }

  const headerRow = (
    <tr>
      <th>#</th>
      <th>User</th>
      <th>Score</th>
      <th>Period Start</th>
      <th>Period End</th>
    </tr>
  )

  const userMapping = {
    "kjem500": "Kate",
    "wjrm500": "Will"
  }

  const rows = getRecords(recordType).map((record, index) => {
    const highlight = isPastPresentOrFuture(record.periodEnd) == PRESENT
    
    // Create a simplified version of the record for the click handler
    const handleClick = () => {
      const clickData = {
        user: record.user,
        periodStart: record.periodStart,
        periodEnd: record.periodEnd,
        type: recordType,
        value: record.days || record.score
      }
      onRecordClick(clickData)
    }
  
    return (
      <tr 
        key={index} 
        style={{backgroundColor: highlight ? "var(--blue-3)" : "", color: highlight ? "white" : ""}} 
        onClick={handleClick}
        className="clickableRow"
      >
        <td>{index + 1}</td>
        <td>{userMapping[record.user]}</td>
        <td>{record.days || record.score}</td>
        <td>{record.periodStart || "-"}</td>
        <td>{record.periodEnd}</td>
      </tr>
    )
  })

  return (
    <div className="page" style={{alignItems: 'center', flexDirection: 'column'}}>
      <select 
        onChange={(event) => setRecordType(event.target.value)} 
        style={{marginBottom: '10px', height: '30px'}}
      >
        <optgroup label="Streak Records">
          <option value={CONSECUTIVE_WINS}>Consecutive wins</option>
          <option value={CONSECUTIVE_DAYS_UNBEATEN}>Consecutive days unbeaten</option>
          <option value={CONSECUTIVE_ONE_BELOW}>Consecutive days scoring 1 or below</option>
          <option value={CONSECUTIVE_TWO_BELOW}>Consecutive days scoring 2 or below</option>
          <option value={CONSECUTIVE_THREE_BELOW}>Consecutive days scoring 3 or below</option>
          <option value={CONSECUTIVE_FOUR_BELOW}>Consecutive days scoring 4 or below</option>
          <option value={CONSECUTIVE_FIVE_BELOW}>Consecutive days scoring 5 or below</option>
        </optgroup>
        <optgroup label="Period Records">
          <option value={WEEKLY_LOW}>Lowest score in week (Mon-Sun)</option>
          <option value={ROLLING_7_LOW}>Lowest score in any 7 days</option>
          <option value={FORTNIGHT_LOW}>Lowest score in fortnight (Mon-Sun)</option>
          <option value={ROLLING_14_LOW}>Lowest score in any 14 days</option>
          <option value={MONTH_LOW}>Lowest score in calendar month</option>
          <option value={ROLLING_28_LOW}>Lowest score in any 28 days</option>
        </optgroup>
      </select>
      <div className="tableContainer" style={{height: "200px"}}>
        <table className="table">
          <thead>
            {headerRow}
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecordPage
