import React from "react"
import { calculateTotal } from "../utilities/arrays"
import { beautifyDate, PAST, PRESENT, FUTURE, isPastPresentOrFuture } from "../utilities/dates"
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
  let dataRows = []
  for (let i = 0; i < dayData[dayIndex].length; i++) {
    const day = dayData[dayIndex][i]
    const pastPresentFuture = isPastPresentOrFuture(day.Date)
    let kateCell, willCell
    switch (pastPresentFuture) {
      case PAST:
        kateCell = (<td style={day.Kate == null ? {color: "darkgrey"} : {}}>{day.Kate || 8}</td>)
        willCell = (<td style={day.Will == null ? {color: "darkgrey"} : {}}>{day.Will || 8}</td>)
        break
      case PRESENT:
        kateCell = loggedInUser.username == "kjem500" && day.Kate == null ?
          (<td><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>) :
          (<td>{day.Kate}</td>)
        willCell = loggedInUser.username == "wjrm500" && day.Will == null ?
          (<td><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>) :
          (<td>{day.Will}</td>)
        break
      case FUTURE:
        kateCell = willCell = <td></td>
    }
    const row = (
      <tr key={day.Date}>
        <td>{beautifyDate(day.Date)}</td>
        {kateCell}
        {willCell}
      </tr>
    )
    dataRows.push(row)
  }
  let kateTotal = calculateTotal(dayData[dayIndex], "Kate")
  let willTotal = calculateTotal(dayData[dayIndex], "Will")
  const summaryRow = <tr style={{backgroundColor: "var(--blue-3)", color: "white"}}>
    <td>Total</td>
    <td>{kateTotal}</td>
    <td>{willTotal}</td>
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