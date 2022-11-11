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

export default beautifyDate