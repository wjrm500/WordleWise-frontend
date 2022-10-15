import React from 'react'

const ScoreTable = ({ cwData }) => {
  // const sundayDayIndex = 0
  // const mondayDayIndex = 1
  // const currentDayIndex = new Date().getDay()
  // const subtractor = currentDayIndex == sundayDayIndex ? 6 : currentDayIndex - mondayDayIndex
  // let monday = new Date()
  // monday.setDate(monday.getDate() - subtractor)
  // let newDate = new Date()
  // newDate.setDate(monday.getDate())
  // const currentWeek = []
  // for (let i = 0; i < 7; i++) {
  //   let newDate = new Date()
  //   newDate.setDate(monday.getDate() + i)
  //   currentWeek.push(newDate)
  // }
  // console.log(currentWeek)
  const numWeeks = cwData.length
  let currentWeekIndex = numWeeks - 1
  console.log(cwData[currentWeekIndex])
  return (
    <table id="scoreTable" cellSpacing={0}>
      <thead>
        <tr>
          <th colSpan="3">Week 1</th>
        </tr>
        <tr>
          <th>Day</th>
          <th>Kate</th>
          <th>Will</th>
        </tr>
      </thead>
      <tbody>
        {
          cwData[currentWeekIndex].map(day => (
            <tr style={{fontFamily: "monospace"}}>
              <td>
                {
                  new Date(
                    day.Date.slice(0, 4),
                    day.Date.slice(4, 6) - 1,
                    day.Date.slice(6, 8)
                  ).toLocaleString(
                    undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    }
                  )
                }
              </td>
              <td>{day.Kate}</td>
              <td>{day.Will}</td>
            </tr>
          ))
        }


        {/* {
          currentWeek.map(x => (
            <tr style={{fontFamily: "monospace"}}>
              <td>
              {
                x.toLocaleString(
                  undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  }
                )
              }
              </td>
              <td></td>
              <td></td>
            </tr>
          ))
        } */}
      </tbody>
    </table>
  )
}

export default ScoreTable