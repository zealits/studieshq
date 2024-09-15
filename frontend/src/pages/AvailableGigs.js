import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs, applyGig } from "../Services/Actions/gigsActions.js"; // Adjust the import path as necessary
import Popup from "./Popup"; // Import the Popup component
import "./AvailableGigs.css";
import { loadUser } from "../Services/Actions/userAction.js";
import calendar from "../Assets/photos/calendar.png";

const AvailableGigs = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [expandedGigId, setExpandedGigId] = useState(null);

  useEffect(() => {
    dispatch(fetchGigs());
  }, [dispatch]);

  const { gigs, successMessage } = useSelector((state) => ({
    gigs: state.gig.gigs, // Adjust state path as necessary
    successMessage: state.gig.successMessage, // Assuming this is where the success message is stored
  }));

  const userGigs = useSelector((state) => state.user.user.gigs);

  // Filter out gigs that the user has applied to, allocated, or completed
  const filteredGigs = gigs.filter((gig) => !userGigs.some((userGig) => userGig.gigId === gig._id));

  const handleApply = (gigId) => {
    dispatch(applyGig(gigId))
      .then(() => {
        setMessage("Application submitted successfully! Go to 'My Studies' page and refresh the page.");
        setShowPopup(true);
      })
      .catch((error) => {
        setMessage("Error applying for the gig. Please try again.");
        setShowPopup(true);
      });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    dispatch(loadUser());
  };

  const formatDate = (dateString) => {
    const [year, day, month] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const toggleDescription = (gigId) => {
    setExpandedGigId(expandedGigId === gigId ? null : gigId);
  };

  return (
    <div className="available-gigs">
      <h2>Available Studies</h2>
      <div className="study-list">
        {filteredGigs && filteredGigs.length > 0 ? (
          filteredGigs.map((gig) => (
            <div key={gig._id} className="homestudy-card">
              <h3 className="study-title">{gig.title}</h3>
              <div className={`study-description ${expandedGigId === gig._id ? "expanded" : ""}`}>
                {expandedGigId === gig._id ? gig.description : `${gig.description.substring(0, 100)}.`}
              </div>
              {gig.description.length > 100 && (
                <button className="read-more-button" onClick={() => toggleDescription(gig._id)}>
                  {expandedGigId === gig._id ? "Read Less" : "Read More"}
                </button>
              )}
              <div className="home-study-details">
                <span className="study-location">
                  Gift Card <div></div>${gig.budget}
                </span>
                <span className="study-date">
                  <img src={calendar} alt="Calendar" className="calendar-icon" /> Last Date<div></div>{" "}
                  {formatDate(gig.deadline)}
                </span>
              </div>
              <button className="apply-button" onClick={() => handleApply(gig._id)}>
                Sign Contract
              </button>
              <button className="apply-button" onClick={() => handleApply(gig._id)}>
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <div>No gigs available</div>
        )}
      </div>
      {showPopup && <Popup message={message} onClose={handleClosePopup} />}
    </div>
  );
};

export default AvailableGigs;
