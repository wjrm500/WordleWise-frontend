import { PAST, PRESENT, FUTURE, isPastPresentOrFuture } from "../utilities/dates"

const arrayChunks = (array, chunk_size) => {
  return Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size))
}

const calculateTotal = (data, key) => {
  let total = 0
  for (let date in data) {
    const day = data[date]
    switch (isPastPresentOrFuture(date)) {
      case PAST:
        total += day[key] || 8
        break
      case PRESENT:
        total += day[key] || 0
        break
      case FUTURE:
        total += 0
        break
    }
  }
  return total
}

export {arrayChunks, calculateTotal}