import React, { useState } from 'react'
import { getUnbeatenStreaks, getWinStreaks } from '../utilities/records'

const RecordPage = ({data}) => {
  const CONSECUTIVE_WINS = "consecWin"
  const CONSECUTIVE_DAYS_UNBEATEN = "consecUnbeat"
  const [recordType, setRecordType] = useState(CONSECUTIVE_WINS)
  
  const getRecords = (recordType) => {
    console.log(recordType)
    switch(recordType) {
      case CONSECUTIVE_WINS:
        return getWinStreaks(data)
      case CONSECUTIVE_DAYS_UNBEATEN:
        return getUnbeatenStreaks(data)
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
  const rows = getRecords(recordType).map((streak, index) => (
    <tr>
      <td>{index + 1}</td>
      <td>{streak.player}</td>
      <td>{streak.numDays}</td>
      <td>{streak.endDate}</td>
    </tr>
  ))
  return (
    <div className="page" style={{alignItems: 'center', flexDirection: 'column'}}>
      <select onChange={(event) => setRecordType(event.target.value)} style={{marginBottom: '5px'}}>
        <option value={CONSECUTIVE_WINS}>Most consecutive wins</option>
        <option value={CONSECUTIVE_DAYS_UNBEATEN}>Most consecutive days unbeaten</option>
      </select>
      <div id="recordTableContainer">
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