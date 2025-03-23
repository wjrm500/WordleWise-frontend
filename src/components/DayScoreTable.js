import React, { useEffect, useState } from "react"
import { calculateTotal } from "../utilities/arrays"
import { beautifyDate, PAST, PRESENT, FUTURE, isPastPresentOrFuture } from "../utilities/dates"
import AddScoreButton from "./AddScoreButton"

const DayScoreTable = ({loggedInUser, dayData, dayIndex, onAddScoreButtonClick, selectedRecordDate}) => {
  const [highlightDate, setHighlightDate] = useState(null)

  useEffect(() => {
    if (selectedRecordDate != null) {
      setHighlightDate(selectedRecordDate)
      setTimeout(() => setHighlightDate(null), 1000)
    }
  }, [selectedRecordDate])
  
  const title = beautifyDate(dayData[dayIndex]["start_of_week"], false, true)
  const headerRow1 = <tr>
    <th colSpan="3">Week starting {title}</th>
  </tr>
  const headerRow2 = <tr>
    <th>Date</th>
    <th className="scoreColumn">Kate</th>
    <th className="scoreColumn">Will</th>
  </tr>
  
  // Add a flag to track if any scores are hidden
  let anyHiddenKate, anyHiddenWill = false
  
  let dataRows = []
  for (let date in dayData[dayIndex]["data"]) {
    const day = dayData[dayIndex]["data"][date]
    const pastPresentFuture = isPastPresentOrFuture(date)
    let kateCell, willCell
    switch (pastPresentFuture) {
      case PAST:
        // If Will is logged in and hasn't entered score but Kate has, show ? for Kate
        if (loggedInUser.username === "wjrm500" && !day.wjrm500 && day.kjem500) {
          kateCell = (<td className="scoreColumn">?</td>)
          anyHiddenKate = true;
        } else {
          kateCell = (<td className="scoreColumn" style={day.kjem500 == null ? {color: "darkgrey"} : {}}>{day.kjem500 || 8}</td>)
        }
        
        // If Kate is logged in and hasn't entered score but Will has, show ? for Will
        if (loggedInUser.username === "kjem500" && !day.kjem500 && day.wjrm500) {
          willCell = (<td className="scoreColumn">?</td>)
          anyHiddenWill = true;
        } else {
          willCell = (<td className="scoreColumn" style={day.wjrm500 == null ? {color: "darkgrey"} : {}}>{day.wjrm500 || 8}</td>)
        }
        break
      case PRESENT:
          // Kate's cell logic
          if (loggedInUser.username == "kjem500" && day.kjem500 == null) {
            kateCell = (<td className="scoreColumn"><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>);
          } else if (loggedInUser.username === "wjrm500" && !day.wjrm500 && day.kjem500) {
            kateCell = (<td className="scoreColumn">?</td>);
            anyHiddenKate = true;
          } else {
            kateCell = (<td className="scoreColumn">{day.kjem500 || ""}</td>);
          }
          
          // Will's cell logic
          if (loggedInUser.username == "wjrm500" && day.wjrm500 == null) {
            willCell = (<td className="scoreColumn"><AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} /></td>);
          } else if (loggedInUser.username === "kjem500" && !day.kjem500 && day.wjrm500) {
            willCell = (<td className="scoreColumn">?</td>);
            anyHiddenWill = true;
          } else {
            willCell = (<td className="scoreColumn">{day.wjrm500 || ""}</td>);
          }
          break;
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

  dataRows = dataRows.map(row => {
    const isHighlighted = highlightDate && row.key == highlightDate
    const rowStyle = isHighlighted ? {backgroundColor: "yellow"} : {}
    return (
      <tr key={row.key} style={rowStyle}>
        {row.props.children}
      </tr>
    )
  })

  // If any scores are hidden, show ? for totals
  let kateTotal = anyHiddenKate ? "?" : calculateTotal(dayData[dayIndex]["data"], "kjem500")
  let willTotal = anyHiddenWill ? "?" : calculateTotal(dayData[dayIndex]["data"], "wjrm500")
  
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