import React from 'react'

const AddScoreModal = ({ addScore }) => {
  const onChange = () => addScore("2022-10-29", "Kate", 2)
  return (
    <div id="addScoreModal">
      <div>Add your score</div>
      <form>
        <select name="score" onChange={onChange}>
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