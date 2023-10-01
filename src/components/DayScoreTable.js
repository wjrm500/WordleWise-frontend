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
    <th className="scoreColumn">Kate</th>
    <th className="scoreColumn">Will</th>
  </tr>
  let dataRows = []
  for (let i = 0; i < dayData[dayIndex].length; i++) {
    const day = dayData[dayIndex][i]
    const pastPresentFuture = isPastPresentOrFuture(day.Date)
    let kateCell, willCell
    switch (pastPresentFuture) {
      case PAST:
        kateCell = (<td className="scoreColumn" style={day.Kate == null ? {color: "darkgrey"} : {}}>{day.Kate || 8}</td>)
        willCell = (<td className="scoreColumn" style={day.Will == null ? {color: "darkgrey"} : {}}>{day.Will || 8}</td>)
        break
      case PRESENT:
        kateCell = loggedInUser.username == "kjem500" && day.Kate == null ?
          (<td className="scoreColumn"><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>) :
          (<td className="scoreColumn">{day.Kate}</td>)
        willCell = loggedInUser.username == "wjrm500" && day.Will == null ?
          (<td className="scoreColumn"><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>) :
          (<td className="scoreColumn">{day.Will}</td>)
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
    <td></td>
    <td className="scoreColumn">{kateTotal}</td>
    <td className="scoreColumn">{willTotal}</td>
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