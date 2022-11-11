import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const LeftArrow = ({active, index, setIndex}) => {
  const onClick = () => active ? setIndex(index - 1) : ""
  return (
    <div className="arrowContainer">
      <div className={active ? "leftArrow arrow active" : "leftArrow arrow"}>
        <FaArrowLeft onClick={onClick} />
      </div>
    </div>
  )
}

export default LeftArrow