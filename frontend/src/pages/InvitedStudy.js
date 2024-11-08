import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSharedGigs } from "../Services/Actions/gigsActions.js";
import axios from "axios"; // Import axios for making requests
import "./InvitedStudy.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InvitedStudy = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);
  const gigs = useSelector((state) => state.gig.gigs); // Adjust state path as necessary
  const userGigs = useSelector((state) => state.user.user.gigs);
  const filteredGigs = gigs.filter((gig) => !userGigs.some((userGig) => userGig.gigId === gig._id));

  const [showModal, setShowModal] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchSharedGigs(userId));
    }
  }, [dispatch, userId]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleApplyClick = (study) => {
    setSelectedStudy(study);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccessMessage(""); // Reset success message when modal is closed
  };

  const handleApply = async () => {
    try {
      const response = await axios.post("/aak/l1/gig/applyForGigWithLanguageLocation", {
        gigId: selectedStudy._id,
        userId,
        language: selectedLanguage,
        location: selectedLocation,
        birthDate: userBirthDate,
      });

      if (response.data.success) {
        setSuccessMessage("Applied successfully!");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error applying for gig:", error);
      setSuccessMessage("Error while applying.");
    }
  };

  const handleDateChange = (date) => {
    setUserBirthDate(date);
  };

  return (
    <div>
      <h2>Invited Studies</h2>
      <hr
        style={{
          border: "none", // Remove default border
          height: "1px", // Set height for the hr
          backgroundColor: "black", // Set the color of the hr
          margin: "20px 30px", // Adjust margins for spacing
          //   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Add shadow for a bold effect
        }}
      />

      <div>
        {filteredGigs && filteredGigs.length > 0 ? (
            filteredGigs.map((studyDetails) => (
            <div className="" key={studyDetails._id}>
              <h1 className="">{studyDetails.title}</h1>

              <div className="study-two-columns-sepration">
                <div className="study-details-image-section">
                  {studyDetails.image && (
                    <img
                      src={
                        studyDetails.image.includes("data:image")
                          ? studyDetails.image
                          : `data:image/png;base64,${studyDetails.image}`
                      }
                      alt="Image Preview"
                      className="study-details-image"
                    />
                  )}
                </div>

                <div className="study-details-info">
                  <div className="">{studyDetails.description}</div>
                  {studyDetails.locations && studyDetails.locations.length > 0 && (
                    <div className="study-details-locations">
                      <span className="study-details-label">Locations :</span> {studyDetails.locations.join(", ")}
                    </div>
                  )}
                  {studyDetails.languages && studyDetails.languages.length > 0 && (
                    <div className="study-details-languages">
                      <span className="study-details-label">Languages :</span> {studyDetails.languages.join(", ")}
                    </div>
                  )}
                  {studyDetails.deadline && (
                    <div className="study-details-deadline">
                      <span className="study-details-label">Last Date : </span> {formatDate(studyDetails.deadline)}
                    </div>
                  )}

                  <button className="study-details-apply" onClick={() => handleApplyClick(studyDetails)}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No invited studies available.</p>
        )}
      </div>

      {/* Modal for applying to study */}
      {showModal && selectedStudy && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Apply for {selectedStudy.title}</h3>

            <div className="form-group">
              <label>Language:</label>
              <select
                className="modal-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {selectedStudy.languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location:</label>
              <select
                className="modal-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {selectedStudy.locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Birth Date:</label>
              <DatePicker
                selected={userBirthDate} // Selected date
                onChange={handleDateChange} // Handle date change
                dateFormat="dd/MM/yyyy" // Customize the date format
                maxDate={new Date()} // Prevent future dates
                showYearDropdown
                scrollableYearDropdown
                className="modal-input" // custom class for styling
              />
            </div>

            <button className="modal-button" onClick={handleApply}>
              Apply
            </button>
            <button className="modal-button modal-close" onClick={handleCloseModal}>
              Close
            </button>

            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitedStudy;
