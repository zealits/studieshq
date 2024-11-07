import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import calendar from "../Assets/photos/calendar.png";
import "./StudyRefrralPage.css";

const StudyReferralPage = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [studyDetails, setStudyDetails] = useState(null);
  const user = null; // Replace with actual user state if available
  const referringUserId = "12345"; // Replace with actual referral ID if available

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`/aak/l1/gig/${studyId}`);
        setStudyDetails(response.data.gig);
        console.log(response.data.gig); // Log project details
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [studyId]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to registration page if not logged in, preserving referral information
      navigate(`/register?redirect=/apply/study/${studyId}&referral=${referringUserId}`);
    } else {
      // If logged in, proceed to application
      navigate(`/apply/studys/${studyId}`);
    }
  };

  return (
    <div className="study-referral-page-container">
      {studyDetails ? (
        <div className="study-details-wrapper">
          <h1 className="study-details-title">{studyDetails.title}</h1>

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
              <div className="study-details-description">{studyDetails.description}</div>
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
              <div className="study-details-deadline">
                <span className="study-details-label">Last Date : </span> {formatDate(studyDetails.deadline)}
              </div>
              <button className="study-details-apply" onClick={handleApplyClick}>
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="study-details-loading-message">Loading study details...</p>
      )}
    </div>
  );
};

export default StudyReferralPage;
