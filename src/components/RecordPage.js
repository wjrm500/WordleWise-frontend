import React from 'react'
import { getWinStreaks } from '../utilities/records'

const RecordPage = ({data}) => {
  const winStreaks = getWinStreaks(data)
  const headerRow = (
    <tr>
      <th>#</th>
      <th>Player</th>
      <th>Num days</th>
      <th>End date</th>
    </tr>
  )
  const rows = winStreaks.map((streak, index) => (
    <tr>
      <td>{index + 1}</td>
      <td>{streak.player}</td>
      <td>{streak.numDays}</td>
      <td>{streak.endDate}</td>
    </tr>
  ))
  return (
    <div className="page" style={{alignItems: 'center', flexDirection: 'column'}}>
      <div style={{paddingBottom: '5px'}}>Most consecutive wins</div>
      <table className="recordTable">
        {headerRow}
        {rows}
      </table>
    </div>
  )
}

export default RecordPage