import React from 'react';

/**
 * Loader component for indicating async operations or page loading.
 */
function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading CrisisTwin Data...</p>
    </div>
  );
}

export default Loader;
