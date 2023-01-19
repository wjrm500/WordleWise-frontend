import React, { useState } from 'react'
import { dateIsToday } from '../utilities/dates'
import { getUnbeatenStreaks, getWinStreaks, getXOrBelowStreaks } from '../utilities/records'

const RecordPage = ({data}) => {
  const CONSECUTIVE_WINS = "consecWin"
  const CONSECUTIVE_DAYS_UNBEATEN = "consecUnbeat"
  const CONSECUTIVE_TWO_BELOW = "consec2"
  const CONSECUTIVE_THREE_BELOW = "consec3"
  const CONSECUTIVE_FOUR_BELOW = "consec4"
  const CONSECUTIVE_FIVE_BELOW = "consec5"
  const [recordType, setRecordType] = useState(CONSECUTIVE_WINS)
  
  const getRecords = (recordType) => {
    switch(recordType) {
      case CONSECUTIVE_WINS:
        return getWinStreaks(data)
      case CONSECUTIVE_DAYS_UNBEATEN:
        return getUnbeatenStreaks(data)
      case CONSECUTIVE_TWO_BELOW:
        return getXOrBelowStreaks(data, 2)
      case CONSECUTIVE_THREE_BELOW:
        return getXOrBelowStreaks(data, 3)
      case CONSECUTIVE_FOUR_BELOW:
        return getXOrBelowStreaks(data, 4)
      case CONSECUTIVE_FIVE_BELOW:
        return getXOrBelowStreaks(data, 5)
    }
  }

  const headerRow = (
    <tr>
      <th>#</th>
      <th>Player</th>
      <th>Days</th>
      <th>End date</th>
    </tr>
  )
  const rows = getRecords(recordType).map((streak, index) => {
    const highlight = dateIsToday(streak.endDate)
    return (
      <tr style={{backgroundColor: highlight ? "var(--blue-3)" : "", color: highlight ? "white" : ""}}>
        <td>{index + 1}</td>
        <td>{streak.player}</td>
        <td>{streak.days}</td>
        <td>{streak.endDate}</td>
      </tr>
    )
  })
  return (
    <div className="page" style={{alignItems: 'center', flexDirection: 'column'}}>
      <select onChange={(event) => setRecordType(event.target.value)} style={{marginBottom: '5px'}}>
        <option value={CONSECUTIVE_WINS}>Consecutive wins</option>
        <option value={CONSECUTIVE_DAYS_UNBEATEN}>Consecutive days unbeaten</option>
        <option value={CONSECUTIVE_TWO_BELOW}>Consecutive days scoring 2 or below</option>
        <option value={CONSECUTIVE_THREE_BELOW}>Consecutive days scoring 3 or below</option>
        <option value={CONSECUTIVE_FOUR_BELOW}>Consecutive days scoring 4 or below</option>
        <option value={CONSECUTIVE_FIVE_BELOW}>Consecutive days scoring 5 or below</option>
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