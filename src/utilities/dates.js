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

const PAST = "PAST"
const PRESENT = "PRESENT"
const FUTURE = "FUTURE"

const isPastPresentOrFuture = (dateStr) => {
  const date = getDateFromStr(dateStr)
  const today = getTodayDate()
  if (date.getTime() < today.getTime()) {
    return PAST
  } else if (date.getTime() == today.getTime()) {
    return PRESENT
  } else {
    return FUTURE
  }
}

export {beautifyDate, getDateFromStr, getTodayDate, PAST, PRESENT, FUTURE, isPastPresentOrFuture}