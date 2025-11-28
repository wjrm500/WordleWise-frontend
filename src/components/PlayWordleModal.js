import React, { useState, useEffect, useContext, useRef } from "react"
import axios from "axios"
import ServerAddrContext from "../contexts/ServerAddrContext"
import ErrorMessage from "./common/ErrorMessage"

const PlayWordleModal = ({ setShowPlayWordleModal }) => {
  const SERVER_ADDR = useContext(ServerAddrContext)
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const linkRef = useRef(null);

  // Check if the form is valid whenever the date changes
  useEffect(() => {
    setIsFormValid(date !== "");
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${SERVER_ADDR}/getWordleAnswer`,
        { date },
        {
          headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        // Update hidden link and click it
        if (linkRef.current) {
          linkRef.current.href = response.data.playable_url;
          linkRef.current.click();
        }
        setShowPlayWordleModal(false);
      } else {
        setError(response.data.error);

        if (response.data.error.includes("format may have changed")) {
          localStorage.setItem('wordle_answer_findable', 'false');
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if feature is disabled
  const isFeatureDisabled = localStorage.getItem('wordle_answer_findable') === 'false';

  return (
    <div className="scoreModal">
      <h2 style={{ marginTop: 0 }}>Play past Wordle</h2>

      {isFeatureDisabled && (
        <ErrorMessage 
          message="This feature may not work reliably due to source website changes."
          style={{ marginBottom: '15px' }}
        />
      )}

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit}>
        <div className="formFields">
          <div className="formGroup">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => setShowPlayWordleModal(false)}
            disabled={isLoading}
            style={{ padding: '8px 16px', cursor: 'pointer', background: '#666', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            style={{
              padding: '8px 16px',
              cursor: !isFormValid || isLoading ? 'not-allowed' : 'pointer',
              background: !isFormValid || isLoading ? '#ccc' : 'var(--blue-1)',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isLoading ? 'Loading...' : 'Play'}
          </button>
        </div>

        {/* Hidden link that will be programmatically clicked */}
        <a
          ref={linkRef}
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'none' }}
        >
          hidden link
        </a>
      </form>
    </div>
  )
}

export default PlayWordleModal;