import React from 'react'

const WeekScoreTable = ({ weekData, weekMaxIndex }) => {
  return (
    <table id="weekScoreTable" className="scoreTable" cellSpacing={0}>
      <thead>
        <tr>
          <th>Start date</th>
          <th>Kate</th>
          <th>Will</th>
        </tr>
      </thead>
      <tbody>
        {
          weekData[weekMaxIndex].map(week => {
            return (
              <tr key={week.StartDate}>
                <td>
                  {
                    new Date(
                      week.StartDate.slice(0, 4),
                      week.StartDate.slice(5, 7) - 1,
                      week.StartDate.slice(8, 10)
                    ).toLocaleString(
                      undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: '2-digit'
                      }
                    )
                  }
                </td>
                <td>
                  { week.KateTotal }
                </td>
                <td>
                  { week.WillTotal }
                </td>
              </tr>
            )
          })
        }
        <tr>
          <td></td>
          <td>
            {
              weekData[weekMaxIndex].reduce((score, week) => score + week.KateTotal, 0)
            }
          </td>
          <td>
            {
              weekData[weekMaxIndex].reduce((score, week) => score + week.WillTotal, 0)
            }
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default WeekScoreTable