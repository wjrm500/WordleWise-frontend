import React, { useEffect, useState } from "react"

const UpdateScoreModal = ({addScore, setShowUpdateScoreModal, users}) => {
  const [date, setDate] = useState("");
  const [user, setUser] = useState("");
  const [score, setScore] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const dateChange = (event) => {
    let tempDate = new Date()
    tempDate.setTime(tempDate.getTime() + (24 * 60 * 60 * 1000))
    let tomorrowDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())
    let inputDate = new Date(event.target.value)
    if (inputDate > tomorrowDate) {
      alert("Date cannot be in the future")
    } else {
      setDate(event.target.value)
    }
  }
  const onSubmit = (event) => {
    event.preventDefault()
    if (isFormValid) {
      addScore(date, user, score, false)
      setShowUpdateScoreModal(false)
    }
  }
  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>{user.username}</option>
  ));
  const scoreOptions = [1, 2, 3, 4, 5, 6, "Fail"].map(option => (
    <option key={option} value={option == "Fail" ? 8 : option}>{option}</option>
  ))

   // Check form validity whenever any input changes
   useEffect(() => {
    setIsFormValid(date !== "" && user !== "" && score !== "");
  }, [date, user, score])

  return (
    <div id="updateScoreModal" className="scoreModal">
      <div style={{fontWeight: "bold"}}>Update score</div>
      <form onSubmit={onSubmit}>
        <div className="formGroup">
          <label htmlFor="date">Date</label>
          <input type="date" name="date" value={date} onChange={dateChange} />
        </div>
        <div className="formGroup">
          <label htmlFor="user">User</label>
          <select name="user" value={user} onChange={event => setUser(event.target.value)}>
            <option value="" disabled>Select a user</option>
            {userOptions}
          </select>
        </div>
        <div className="formGroup">
          <label htmlFor="score">Score</label>
          <select name="score" value={score} onChange={event => setScore(event.target.value)}>
            <option value="" disabled>Select a score</option>
            {scoreOptions}
          </select>
        </div>
        <button className="headerButton" disabled={!isFormValid}>Submit</button>
      </form>
    </div>
  )
}

export default UpdateScoreModal