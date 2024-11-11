import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSharedGigs } from "../Services/Actions/gigsActions.js";
import axios from "axios";
import "./InvitedStudy.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InvitedStudy = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);
  const dob = useSelector((state) => state.user.user.dateOfBirth);

  useEffect(() => {
    if (userId) {
      dispatch(fetchSharedGigs(userId));
    }
  }, [dispatch, userId]);

  const [userBirthDate, setUserBirthDate] = useState(null);

  // Set initial birth date to user's date of birth
  useEffect(() => {
    if (dob) {
      setUserBirthDate(new Date(dob)); // Convert "YYYY-MM-DD" format to Date object
    }
  }, [dob]);

  const handleDateChange = (date) => {
    setUserBirthDate(date);
  };

  const gigs = useSelector((state) => state.gig.gigs);
  const userGigs = useSelector((state) => state.user.user?.gigs || []);
  const filteredGigs = (gigs || []).filter((gig) => !userGigs.some((userGig) => userGig.gigId === gig._id));

  const [showModal, setShowModal] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleApplyClick = (study) => {
    setSelectedStudy(study);
    setShowModal(true);
    setErrorMessage(""); // Reset error message when modal opens
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccessMessage("");
    setErrorMessage(""); // Reset error message when modal is closed
  };

  const handleApply = async () => {
    if (!selectedLanguage || !selectedLocation || !userBirthDate) {
      setErrorMessage("Please select all required fields."); // Set error message if fields are missing
      return;
    }

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

  // const handleDateChange = (date) => {
  //   setUserBirthDate(date);
  // };

  return (
    <div>
      <h2>Invited Studies</h2>
      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "black",
          margin: "20px 30px",
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
                <option value="">Select a language</option>
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
                <option value="">Select a location</option>
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
                selected={userBirthDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                className="modal-input"
              />
            </div>

            <button className="modal-button" onClick={handleApply}>
              Apply
            </button>
            <button className="modal-button modal-close" onClick={handleCloseModal}>
              Close
            </button>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitedStudy;
