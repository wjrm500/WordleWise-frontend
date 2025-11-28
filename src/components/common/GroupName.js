import React from 'react';

const GroupName = ({ group, showId = true }) => {
  if (!group) return null;
  
  return (
    <span className="group-name">
      <span className="group-name-text">{group.name}</span>
      {showId && group.id && (
        <span className="group-name-id">({group.id})</span>
      )}
    </span>
  );
};

export default GroupName;