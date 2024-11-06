import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudyReferralPage = () => {
  const { studyId } = useParams();
  const [studyDetails, setStudyDetails] = useState(null);

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

  return (
    <div>
      <h1>Study Details</h1>
      {studyDetails ? (
        <div>
      <h3 className="study-title">{studyDetails.title}</h3>

      {studyDetails.image && (
        <img
          src={
            studyDetails.image.includes("data:image")
              ? studyDetails.image
              : `data:image/png;base64,${studyDetails.image}`
          }
          alt="Image Preview"
          className="image-preview"
        />
      )}

      <div className="home-study-details">
        <span className="study-location">
          GiftCard <div></div>${studyDetails.budget}
        </span>
        <span className="study-date">
          {/* <img src={calendar} alt="Calendar" className="calendar-icon" /> Last Date<div></div>{" "} */}
          {/* {formatDate(studyDetails.deadline)} */}
        </span>
      </div>
    </div>
      ) : (
        <p>Loading study details...</p>
      )}
    </div>
  );
};

export default StudyReferralPage;
