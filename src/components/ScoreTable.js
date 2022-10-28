import React, { useState } from 'react'
import AddScoreButton from './AddScoreButton'

const ScoreTable = ({ loggedInUser, cwData, cwIndex, onAddScoreButtonClick }) => {
  return (
    <table id="scoreTable" cellSpacing={0}>
      <thead>
        <tr>
          <th colSpan="3">Week {cwIndex + 1}</th>
        </tr>
        <tr>
          <th>Day</th>
          <th>Kate</th>
          <th>Will</th>
        </tr>
      </thead>
      <tbody>
        {
          cwData[cwIndex].map(day => {
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
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      }
                    )
                  }
                </td>
                <td>
                  {
                    dateIsToday && loggedInUser == 'Kate' && day.Kate == null
                    ? <AddScoreButton onAddScoreButtonClick={onAddScoreButtonClick} />
                    : day.Kate
                  }
                </td>
                <td>
                  {
                    dateIsToday && loggedInUser == 'Will' && day.Will == null
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
              cwData[cwIndex].reduce((score, day) => score + day.Kate, 0)
            }
          </td>
          <td>
            {
              cwData[cwIndex].reduce((score, day) => score + day.Will, 0)
            }
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default ScoreTable