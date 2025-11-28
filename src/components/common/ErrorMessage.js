import React from 'react';

const ErrorMessage = ({ message, onDismiss, style }) => {
  if (!message) return null;
  
  return (
    <div className="error-message" style={style}>
      <span className="error-message-text">{message}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="error-message-dismiss"
          type="button"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;