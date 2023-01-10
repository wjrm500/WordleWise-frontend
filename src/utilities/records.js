const getMostConsecutiveWins = (data) => {
  let previousWinner = null
  let currentWinner = null
  let streaks = []
  for (let week of data) {
    for (let day of week) {
      if (day.Kate < day.Will) {
        currentWinner = "Kate"
      } else if (day.Will < day.Kate) {
        currentWinner = "Will"
      } else {
        currentWinner = null
      }
      if (currentWinner) {
        if (currentWinner != previousWinner) {
          streaks.push([currentWinner, 1, day.Date])
        } else if (currentWinner == previousWinner) {
          let [currentStreak] = streaks.slice(-1)
          currentStreak[1] += 1
          currentStreak[2] = day.Date
          streaks[streaks.length - 1] = currentStreak
        }
      }
      previousWinner = currentWinner
    }
  }
  return streaks
}

export {getMostConsecutiveWins}