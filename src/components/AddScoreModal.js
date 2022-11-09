import React from "react"

const AddScoreModal = ({ loggedInUser, addScore, setShowAddScoreModal }) => {
  const onChange = (event) => {
    const dateToday = new Date().toLocaleDateString("en-GB", {timeZone: "Asia/Singapore"}).split("/").reverse().join("-")
    addScore(dateToday, loggedInUser, event.target.value)
    setShowAddScoreModal(false)
  }
  const options = [1, 2, 3, 4, 5, 6, "Fail"].map(option => (
    <option value={option}>{option}</option>
  ))
  return (
    <div id="addScoreModal">
      <div>Add your score</div>
      <form>
        <select name="score" onChange={onChange}>
          <option value="" selected disabled>Select</option>
          {options}
        </select>
      </form>
    </div>
  )
}

export default AddScoreModal