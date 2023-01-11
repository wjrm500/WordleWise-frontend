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
  const summaryRow = <tr style={{backgroundColor: "var(--blue-3)", color: "white"}}>
    <td>Total</td>
    <td>{dayData[dayIndex].reduce((score, day) => score + day.Kate, 0)}</td>
    <td>{dayData[dayIndex].reduce((score, day) => score + day.Will, 0)}</td>
  </tr>
  return (
    <div style={{width: "75%"}}>
      <table id="dayScoreTable" className="scoreTable table">
        <thead>
          {headerRow1}
          {headerRow2}
        </thead>
        <tbody>
          {dataRows}
        </tbody>
      </table>
      <table className="scoreTable table" style={{marginTop: "5px"}}>
        <tbody>
          {summaryRow}
        </tbody>
      </table>
    </div>
  )
}

export default DayScoreTable