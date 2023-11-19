import React from "react"

const AddScoreModal = ({loggedInUser, addScore, setShowAddScoreModal}) => {
  const onChange = (event) => {
    const dateToday = new Date().toLocaleDateString("en-GB", {timeZone: "Europe/London"}).split("/").reverse().join("-")
    addScore(dateToday, loggedInUser.id, event.target.value)
    setShowAddScoreModal(false)
  }
  const options = [1, 2, 3, 4, 5, 6, "Fail"].map(option => (
    <option value={option == "Fail" ? 8 : option}>{option}</option>
  ))
  return (
    <div id="addScoreModal" className="scoreModal">
      <div>Add your score</div>
      <form>
        <select name="score" onChange={onChange} value="">
          <option value="" disabled>Select</option>
          {options}
        </select>
      </form>
    </div>
  )
}

export default AddScoreModal