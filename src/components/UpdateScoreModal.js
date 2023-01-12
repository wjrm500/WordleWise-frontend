import React, { useState } from "react"

const UpdateScoreModal = ({addScore, setShowUpdateScoreModal}) => {
  const [date, setDate] = useState("");
  const [player, setPlayer] = useState("");
  const [score, setScore] = useState("");
  const dateChange = (event) => {
    let tempDate = new Date()
    tempDate.setTime(tempDate.getTime() + (24 * 60 * 60 * 1000))
    let tomorrowDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())
    let inputDate = new Date(event.target.value)
    console.log(tomorrowDate)
    console.log(inputDate)
    console.log(inputDate > tomorrowDate)
    if (inputDate > tomorrowDate) {
      alert("Date cannot be in the future")
    } else {
      setDate(event.target.value)
    }
  }
  const onSubmit = (event) => {
    event.preventDefault()
    addScore(date, player, score)
    setShowUpdateScoreModal(false)
  }
  const playerOptions = [{display: "Kate", value: "kjem500"}, {display: "Will", value: "wjrm500"}].map(option => (
    <option value={option.value}>{option.display}</option>
  ))
  const scoreOptions = [1, 2, 3, 4, 5, 6, "Fail"].map(option => (
    <option value={option == "Fail" ? 8 : option}>{option}</option>
  ))
  return (
    <div id="updateScoreModal" className="scoreModal">
      <div style={{fontWeight: "bold"}}>Update score</div>
      <form onSubmit={onSubmit}>
        <div className="formGroup">
          <label htmlFor="date">Date</label>
          <input type="date" name="date" value={date} onChange={dateChange} />
        </div>
        <div className="formGroup">
          <label htmlFor="player">Player</label>
          <select name="player" value={player} onChange={event => setPlayer(event.target.value)}>
            <option value="" disabled>Select a player</option>
            {playerOptions}
          </select>
        </div>
        <div className="formGroup">
          <label htmlFor="score">Score</label>
          <select name="score" value={score} onChange={event => setScore(event.target.value)}>
            <option value="" disabled>Select a score</option>
            {scoreOptions}
          </select>
        </div>
        <button className="headerButton">Submit</button>
      </form>
    </div>
  )
}

export default UpdateScoreModal