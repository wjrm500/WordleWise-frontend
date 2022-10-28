import React from 'react'

const AddScoreModal = ({ loggedInUser, addScore, setShowAddScoreModal }) => {
  const onChange = (event) => {
    const dateToday = new Date().toLocaleDateString("en-GB", {timeZone: "Asia/Singapore"}).split("/").reverse().join("-")
    addScore(dateToday, loggedInUser, event.target.value)
    setShowAddScoreModal(false)
  }
  return (
    <div id="addScoreModal">
      <div>Add your score</div>
      <form>
        <select name="score" onChange={onChange}>
          <option value="" selected disabled>Select</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="8">Fail</option>
        </select>
      </form>
    </div>
  )
}

export default AddScoreModal