const beautifyDate = (date) => {
  return new Date(
    date.slice(0, 4),
    date.slice(5, 7) - 1,
    date.slice(8, 10)
  ).toLocaleString(
    undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit"
    }
  )
}

const dateIsToday = (dateString) => {
  const date = new Date(
    dateString.slice(0, 4),
    dateString.slice(5, 7) - 1,
    dateString.slice(8, 10)
  )
  const dateToday = new Date()
  return date.getFullYear() == dateToday.getFullYear()
    && date.getMonth() == dateToday.getMonth()
    && date.getDate() == dateToday.getDate()
}

export {beautifyDate, dateIsToday}