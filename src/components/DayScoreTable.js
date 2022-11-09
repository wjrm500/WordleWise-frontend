import React from "react"
import AddScoreButton from "./AddScoreButton"

const DayScoreTable = ({ loggedInUser, dayData, dayIndex, onAddScoreButtonClick }) => {
  return (
    <table id="dayScoreTable" className="scoreTable" cellSpacing={0}>
      <thead>
        <tr>
          <th colSpan="3">Week {dayIndex + 1}</th>
        </tr>
        <tr>
          <th>Date</th>
          <th>Kate</th>
          <th>Will</th>
        </tr>
      </thead>
      <tbody>
        {
          dayData[dayIndex].map(day => {
            let date = new Date(
              day.Date.slice(0, 4),
              day.Date.slice(5, 7) - 1,
              day.Date.slice(8, 10)
            )
            let dateToday = new Date()
            let dateIsToday = date.getFullYear() == dateToday.getFullYear()
              && date.getMonth() == dateToday.getMonth()
              && date.getDate() == dateToday.getDate()
            return (
              <tr key={day.Date}>
                <td>
                  {
                    new Date(
                      day.Date.slice(0, 4),
                      day.Date.slice(5, 7) - 1,
                      day.Date.slice(8, 10)
                    ).toLocaleString(
                      undefined, {
                        weekday: "short",
                        month: "short",
                        day: "2-digit"
                      }
                    )
                  }
                </td>
                <td>
                  {
                    dateIsToday && loggedInUser == "kjem500" && day.Kate == null
                    ? <AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} />
                    : day.Kate
                  }
                </td>
                <td>
                  {
                    dateIsToday && loggedInUser == "wjrm500" && day.Will == null
                    ? <AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} />
                    : day.Will
                  }
                </td>
              </tr>
            )
          })
        }
        <tr>
          <td></td>
          <td>
            {
              dayData[dayIndex].reduce((score, day) => score + day.Kate, 0)
            }
          </td>
          <td>
            {
              dayData[dayIndex].reduce((score, day) => score + day.Will, 0)
            }
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default DayScoreTable