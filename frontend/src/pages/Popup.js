// Popup.js
import React from "react";
import "./Popup.css"; // Ensure you create a CSS file for styling the popup

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Notification</h2>
        <p>{message}</p>
        <button className="btn btn-info" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
