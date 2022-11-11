import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

const RightArrow = ({active, index, setIndex}) => {
  const onClick = () => active ? setIndex(index + 1) : ""
  return (
    <div className="arrowContainer">
      <div className={active ? "rightArrow arrow active" : "rightArrow arrow"}>
        <FaArrowRight onClick={onClick} />
      </div>
    </div>
  )
}

export default RightArrow