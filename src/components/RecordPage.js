import React, { useState } from 'react'
import { getUnbeatenStreaks, getWinStreaks } from '../utilities/records'

const RecordPage = ({data}) => {
  const [recordType, setRecordType] = useState("Most consecutive wins")
  
  const getRecords = (recordType) => {
    console.log(recordType)
    switch(recordType) {
      case "Most consecutive wins":
        return getWinStreaks(data)
      case "Most consecutive rounds unbeaten":
        return getUnbeatenStreaks(data)
    }
  }

  const headerRow = (
    <tr>
      <th>#</th>
      <th>Player</th>
      <th>Num days</th>
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
        <option value="Most consecutive wins">Most consecutive wins</option>
        <option value="Most consecutive rounds unbeaten">Most consecutive rounds unbeaten</option>
      </select>
      <table className="table">
        <thead>
          {headerRow}
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default RecordPage