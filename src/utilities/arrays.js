import { PRESENT, FUTURE, isPastPresentOrFuture } from "../utilities/dates"

const arrayChunks = (array, chunk_size) => {
  return Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size))
}

const calculateTotal = (data, key) => {
  return data
    .filter((day) => isPastPresentOrFuture(day.Date) != FUTURE)
    .map((day) => isPastPresentOrFuture(day.Date) == PRESENT ? 0 : day[key] || 8)
    .reduce((acc, score) => acc + score, 0)
}

export {arrayChunks, calculateTotal}