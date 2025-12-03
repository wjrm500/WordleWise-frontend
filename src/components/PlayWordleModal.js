import React, { useState, useEffect } from "react"
import api from "../utilities/api"
import ErrorMessage from "./common/ErrorMessage"

const PlayWordleModal = ({ setShowPlayWordleModal }) => {
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [manualUrl, setManualUrl] = useState(null); // Fallback if popup is blocked

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
    setManualUrl(null);

    // Open window IMMEDIATELY (user-initiated) to avoid popup blocker on iOS Safari
    // This must happen synchronously in the click handler, before any async operations
    const newWindow = window.open('about:blank', '_blank');

    try {
      const response = await api.get("/wordle/answer", { params: { date } });

      if (response.data.success) {
        const url = response.data.playable_url;

        if (newWindow && !newWindow.closed) {
          // Redirect the pre-opened window to the Wordle URL
          newWindow.location.href = url;
          setShowPlayWordleModal(false);
        } else {
          // Popup was blocked - show link for manual click
          setManualUrl(url);
        }
      } else {
        // Close the blank window if there was an error
        if (newWindow && !newWindow.closed) {
          newWindow.close();
        }
        setError(response.data.error);

        if (response.data.error.includes("format may have changed")) {
          localStorage.setItem('wordle_answer_findable', 'false');
        }
      }

    } catch (err) {
      // Close the blank window if there was an error
      if (newWindow && !newWindow.closed) {
        newWindow.close();
      }
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
      <h2 style={{ marginTop: 0 }}>Play Wordle</h2>

      {isFeatureDisabled && (
        <ErrorMessage
          message="This feature may not work reliably due to source website changes."
        />
      )}

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {/* Fallback link if popup was blocked */}
      {manualUrl && (
        <div className="wordle-fallback-link">
          <p>Tap the link below to play:</p>
          <a
            href={manualUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Wordle Game
          </a>
        </div>
      )}

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
        <div className="modal-button-row">
          <button
            type="button"
            onClick={() => setShowPlayWordleModal(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Loading...' : 'Play'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlayWordleModal;
