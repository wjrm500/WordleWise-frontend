const arrayChunks = (array, chunk_size) => {
  return Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size))
}

export default arrayChunks