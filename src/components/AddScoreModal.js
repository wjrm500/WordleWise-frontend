import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import ScopeContext from "../contexts/ScopeContext"
import ErrorMessage from "./common/ErrorMessage"

const AddScoreModal = ({ onClose }) => {
  const { user } = useContext(AuthContext)
  const { addScore } = useContext(ScopeContext)

  const [date, setDate] = useState("")
  const [score, setScore] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDate(today)
  }, [])

  const handleDateChange = (event) => {
    const inputDate = new Date(event.target.value)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    if (inputDate >= tomorrow) {
      setError("Date cannot be in the future")
    } else {
      setError(null)
      setDate(event.target.value)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!date || !score) return

    setIsLoading(true)
    setError(null)

    try {
      await addScore(date, score === "delete" ? null : parseInt(score))
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add score. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Score options: 1-6 for guesses, 7 for not completed, 8 for failed
  const scoreOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 8, label: "Failed" },
    { value: "delete", label: "Not completed" },
  ]

  return (
    <div className="scoreModal">
      <h2 style={{ marginTop: 0 }}>Add Score</h2>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="formGroup">
          <label>Score</label>
          <select
            value={score}
            onChange={event => setScore(event.target.value)}
            required
          >
            <option value="" disabled>Select a score</option>
            {scoreOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{ padding: '8px 16px', cursor: 'pointer', background: '#666', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!date || !score || isLoading}
            style={{
              padding: '8px 16px',
              cursor: !date || !score || isLoading ? 'not-allowed' : 'pointer',
              background: !date || !score || isLoading ? '#ccc' : 'var(--blue-1)',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddScoreModal;