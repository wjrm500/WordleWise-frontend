import React from "react"
import { calculateTotal } from "../utilities/arrays"
import { beautifyDate, PAST, PRESENT, FUTURE, isPastPresentOrFuture } from "../utilities/dates"
import AddScoreButton from "./AddScoreButton"

const DayScoreTable = ({loggedInUser, dayData, dayIndex, onAddScoreButtonClick}) => {
  const title = beautifyDate(dayData[dayIndex]["start_of_week"], false, true)
  const headerRow1 = <tr>
    <th colSpan="3">Week starting {title}</th>
  </tr>
  const headerRow2 = <tr>
    <th>Date</th>
    <th className="scoreColumn">Kate</th>
    <th className="scoreColumn">Will</th>
  </tr>
  let dataRows = []
  for (let date in dayData[dayIndex]["data"]) {
    const day = dayData[dayIndex]["data"][date]
    const pastPresentFuture = isPastPresentOrFuture(date)
    let kateCell, willCell
    switch (pastPresentFuture) {
      case PAST:
        kateCell = (<td className="scoreColumn" style={day.kjem500 == null ? {color: "darkgrey"} : {}}>{day.kjem500 || 8}</td>)
        willCell = (<td className="scoreColumn" style={day.wjrm500 == null ? {color: "darkgrey"} : {}}>{day.wjrm500 || 8}</td>)
        break
      case PRESENT:
        kateCell = loggedInUser.username == "kjem500" && day.kjem500 == null ?
          (<td className="scoreColumn"><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>) :
          (<td className="scoreColumn">{day.kjem500 || ""}</td>)
        willCell = loggedInUser.username == "wjrm500" && day.wjrm500 == null ?
          (<td className="scoreColumn"><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>) :
          (<td className="scoreColumn">{day.wjrm500 || ""}</td>)
        break
      case FUTURE:
        kateCell = willCell = <td></td>
    }
    const row = (
      <tr key={date}>
        <td>{beautifyDate(date)}</td>
        {kateCell}
        {willCell}
      </tr>
    )
    dataRows.push(row)
  }
  let kateTotal = calculateTotal(dayData[dayIndex]["data"], "kjem500")
  let willTotal = calculateTotal(dayData[dayIndex]["data"], "wjrm500")
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