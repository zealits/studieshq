import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs, applyGig } from "../Services/Actions/gigsActions.js"; // Adjust the import path as necessary
import Popup from "./Popup"; // Import the Popup component
import "./AvailableGigs.css";
import { loadUser } from "../Services/Actions/userAction.js";
import calendar from "../Assets/photos/calendar.png";
import axios from "axios"; // Make sure to install axios using npm or yarn
import PdfPopup from "./PdfPopup.js";

const AvailableGigs = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPdfPopup, setShowPdfPopup] = useState(false); // To show PDF popup
  const [pdfBlob, setPdfBlob] = useState(null); // Store PDF Blob here
  const [expandedGigId, setExpandedGigId] = useState(null);
  const [cid, setCid] = useState(null);
  const [gigId, setGigId] = useState(null);

  useEffect(() => {
    dispatch(fetchGigs());
  }, [dispatch]);

  const { gigs, successMessage } = useSelector((state) => ({
    gigs: state.gig.gigs, // Adjust state path as necessary
    successMessage: state.gig.successMessage, // Assuming this is where the success message is stored
  }));

  const userGigs = useSelector((state) => state.user.user.gigs);
  const userEmail = useSelector((state) => state.user.user.email);
  const contractSigned = userGigs.filter((gig) => gig.status === "contractSigned");
  const userId = useSelector((state) => state.user.user._id);

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

  const handleContractPDf = async (contractId, xgigId) => {
    try {
      const response = await axios.get(`/aak/l1/contract/${contractId}`);
      let byteArray = response.data.pdfData.data;
      let binary = "";
      const bytes = new Uint8Array(byteArray);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      setGigId(xgigId);
      setCid(contractId);
      setPdfBlob(binary); // Set the blob data in state
      setShowPdfPopup(true); // Open the PDF popup
    } catch (error) {
      console.error("Error fetching the PDF", error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    dispatch(loadUser());
  };

  const formatDate = (dateString) => {
    // console.log(dateString);
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
  const formatDateForSigned = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth returns 0-indexed month
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  const toggleDescription = (gigId) => {
    setExpandedGigId(expandedGigId === gigId ? null : gigId);
  };

  const handleClosePdfPopup = () => {
    setShowPdfPopup(false);
    setPdfBlob(null); // Clear the blob after closing
  };

  const handleViewContractPDf = (gigId) => {
    // console.log(pdfId);
    console.log(gigId);

    axios
      .get(`aak/l1/user/${userId}/gig/${gigId}/contract-pdf`, {
        responseType: "blob",
      })
      .then((response) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `contract_${gigId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading the contract PDF", error);
      });
  };

  return (
    <div className="available-gigs">
      <h2>Available Studies</h2>
      <div className="study-list">
        {/* Display contract signed gigs */}
        {contractSigned.length > 0 &&
          contractSigned.map((gig) => (
            <div key={gig._id} className="homestudy-card signed-contract-card">
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
                  <img src={calendar} alt="Calendar" className="calendar-icon" /> Last Date<div></div>
                  {formatDateForSigned(gig.deadline)}
                </span>
              </div>
              <button className="apply-button" onClick={() => handleViewContractPDf(gig._id)}>
                Download Signed Contract
              </button>
              <button className="apply-button" onClick={() => handleApply(gig.gigId)}>
                Apply Now
              </button>
            </div>
          ))}

        {/* Render available gigs */}
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
                  <img src={calendar} alt="Calendar" className="calendar-icon" /> Last Date<div></div>
                  {formatDate(gig.deadline)}
                </span>
              </div>
              <button className="apply-button" onClick={() => handleContractPDf(gig.pdf, gig._id)}>
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

      {showPdfPopup && pdfBlob && (
        <PdfPopup blobData={pdfBlob} cid2={cid} gigId2={gigId} onClose={handleClosePdfPopup} />
      )}

      {showPopup && <Popup message={message} onClose={handleClosePopup} />}
    </div>
  );
};

export default AvailableGigs;
