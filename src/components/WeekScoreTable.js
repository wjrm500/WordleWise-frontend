import React from "react"

const WeekScoreTable = ({weekData, onWeekRowClick}) => {
  const headerRow = <tr>
    <th>#</th>
    <th>Week starting</th>
    <th>Kate</th>
    <th>Will</th>
  </tr>

  const dataRows = weekData.map(week => {
    const kateWins = week.KateTotal < week.WillTotal;
    const isTie = week.KateTotal === week.WillTotal;
    const kateStyle = {
      ...kateWins ? { color: 'green' } : (isTie ? {} : { color: 'red' })
    };
    const willStyle = {
      ...kateWins ? { color: 'red' } : (isTie ? {} : { color: 'green' })
    };

    return (
      <tr key={week.StartDate} onClick={() => onWeekRowClick(week.index)} className="clickableRow">
        <td>{week.index + 1}</td>
        <td>{week.StartOfWeek}</td>
        <td className="scoreColumn" style={kateStyle}>{week.KateTotal}</td>
        <td className="scoreColumn" style={willStyle}>{week.WillTotal}</td>
      </tr>
    )
  })

  const summaryRow = <tr style={{backgroundColor: "var(--blue-3)", color: "white"}}>
    <td></td>
    <td></td>
    <td className="scoreColumn">{weekData.reduce((score, week) => score + week.KateTotal, 0)}</td>
    <td className="scoreColumn">{weekData.reduce((score, week) => score + week.WillTotal, 0)}</td>
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
