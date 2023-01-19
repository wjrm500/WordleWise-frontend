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

const getDateFromStr = (dateStr) => new Date(...dateStr.split("-").map(x => parseInt(x, 10)).map((x, i) => i == 1 ? x - 1 : x))

const getTodayDate = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const dateIsToday = (dateStr) => getDateFromStr(dateStr).getTime() == getTodayDate().getTime()

export {beautifyDate, getDateFromStr, getTodayDate, dateIsToday}