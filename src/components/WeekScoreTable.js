import React from "react"
import { beautifyDate } from "../utilities/dates.js"

const WeekScoreTable = ({weekData}) => {
  const headerRow = <tr>
    <th>Start date</th>
    <th>Kate</th>
    <th>Will</th>
  </tr>
  const dataRows = weekData.map(week => {
    return (
      <tr key={week.StartDate}>
        <td>{beautifyDate(week.StartDate)}</td>
        <td>{week.KateTotal}</td>
        <td>{week.WillTotal}</td>
      </tr>
    )
  })
  const summaryRow = <tr style={{backgroundColor: "var(--blue-3)", color: "white"}}>
    <td>Total</td>
    <td>{weekData.reduce((score, week) => score + week.KateTotal, 0)}</td>
    <td>{weekData.reduce((score, week) => score + week.WillTotal, 0)}</td>
  </tr>
  return (
    <div style={{width: "100%"}}>
      <div className="tableContainer" style={{height: "200px"}}>
        <table className="scoreTable table">
          <thead>
            {headerRow}
          </thead>
          <tbody>
            {dataRows}
          </tbody>
        </table>
      </div>
      <div className="tableContainer" style={{marginTop: "5px"}}>
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