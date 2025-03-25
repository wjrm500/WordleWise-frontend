import React, { useState, useEffect, useContext, useRef } from "react"
import axios from "axios"
import ServerAddrContext from "../contexts/ServerAddrContext"

const PlayWordleModal = ({setShowPlayWordleModal}) => {
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
      setError(`Error: ${err.response?.data?.error || err.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if feature is disabled
  const isFeatureDisabled = localStorage.getItem('wordle_answer_findable') === 'false';
  
  return (
    <div id="playWordleModal" className="scoreModal">
      <div style={{fontWeight: "bold"}}>Play past Wordle</div>
      
      {isFeatureDisabled && (
        <div style={{color: 'red', marginBottom: '10px'}}>
          This feature may not work reliably due to source website changes.
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
          
          {error && (
            <div style={{color: 'red', margin: '10px 0'}}>
              {error}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="headerButton" 
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Loading...' : 'Play'}
        </button>

        {/* Hidden link that will be programmatically clicked */}
        <a
          ref={linkRef}
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          style={{display: 'none'}}
        >
          hidden link
        </a>
      </form>
    </div>
  )
}

export default PlayWordleModal