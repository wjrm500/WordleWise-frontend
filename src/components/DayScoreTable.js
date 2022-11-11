import React from "react"
import { beautifyDate, dateIsToday } from "../utilities/dates"
import AddScoreButton from "./AddScoreButton"

const DayScoreTable = ({loggedInUser, dayData, dayIndex, onAddScoreButtonClick}) => {
  const headerRow1 = <tr>
    <th colSpan="3">Week {dayIndex + 1}</th>
  </tr>
  const headerRow2 = <tr>
    <th>Date</th>
    <th>Kate</th>
    <th>Will</th>
  </tr>
  const dataRows =
    dayData[dayIndex].map(day => {
      const today = dateIsToday(day.Date)
      return (
        <tr key={day.Date}>
          <td>{beautifyDate(day.Date)}</td>
          <td>
            {
              today && loggedInUser == "kjem500" && day.Kate == null
              ? <AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} />
              : day.Kate
            }
          </td>
          <td>
            {
              today && loggedInUser == "wjrm500" && day.Will == null
              ? <AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} />
              : day.Will
            }
          </td>
        </tr>
      )
    })
  const summaryRow = <tr>
    <td></td>
    <td>{dayData[dayIndex].reduce((score, day) => score + day.Kate, 0)}</td>
    <td>{dayData[dayIndex].reduce((score, day) => score + day.Will, 0)}</td>
  </tr>
  return (
    <table id="dayScoreTable" className="scoreTable" cellSpacing="0">
      <thead>
        {headerRow1}
        {headerRow2}
      </thead>
      <tbody>
        {dataRows}
        {summaryRow}
      </tbody>
    </table>
  )
}

export default DayScoreTable