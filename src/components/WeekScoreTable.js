import React from "react"
import { beautifyDate } from "../utilities/dates.js"

const WeekScoreTable = ({weekData, weekIndex}) => {
  const headerRow = <tr>
    <th>Start date</th>
    <th>Kate</th>
    <th>Will</th>
  </tr>
  const dataRows = weekData[weekIndex].map(week => {
    return (
      <tr key={week.StartDate}>
        <td>{beautifyDate(week.StartDate)}</td>
        <td>{week.KateTotal}</td>
        <td>{week.WillTotal}</td>
      </tr>
    )
  })
  const summaryRow = <tr>
    <td></td>
    <td>{weekData[weekIndex].reduce((score, week) => score + week.KateTotal, 0)}</td>
    <td>{weekData[weekIndex].reduce((score, week) => score + week.WillTotal, 0)}</td>
  </tr>
  return (
    <table id="weekScoreTable" className="scoreTable" cellSpacing="0">
      <thead>
        {headerRow}
      </thead>
      <tbody>
        {dataRows}
        {summaryRow}
      </tbody>
    </table>
  )
}

export default WeekScoreTable