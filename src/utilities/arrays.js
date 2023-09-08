import { PAST, PRESENT, FUTURE, isPastPresentOrFuture } from "../utilities/dates"

const arrayChunks = (array, chunk_size) => {
  return Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size))
}

const calculateTotal = (data, key) => {
  return data
    .map((day) => {
      switch (isPastPresentOrFuture(day.Date)) {
        case PAST: return day[key] || 8
        case PRESENT: return day[key] || 0
        case FUTURE: return 0
      }
    })
    .reduce((acc, score) => acc + score, 0)
}

export {arrayChunks, calculateTotal}