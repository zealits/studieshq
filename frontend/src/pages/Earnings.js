import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-modal";
import "./Earnings.css";

const Earnings = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const userGigs = useSelector((state) => state.user.user.gigs);
  const completedGigs = userGigs.filter((gig) => gig.status === "completed");

  useEffect(() => {
    // Load gigs from API initially (if required)
    // You may want to refetch the gigs to get updated paymentStatus
    // fetchGigs();
  }, []);

  const handleRequestGiftCard = async (gigId) => {
    setLoading(true);
    setMessage("");
    setModalIsOpen(false);

    try {
      // Call API to request gift card
      const response = await axios.post(`/aak/l1/gig/${gigId}/request-gift-card`);
      // Update the paymentStatus in the state
      setGigs((prevGigs) => prevGigs.map((gig) => (gig._id === gigId ? { ...gig, paymentStatus: "requested" } : gig)));
      setModalMessage("Gift card request submitted successfully!");
    } catch (error) {
      console.error("Error submitting gift card request", error);
      setModalMessage("Error submitting gift card request. Please try again later.");
    } finally {
      setLoading(false);
      setModalIsOpen(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="earnings-page">
      <h2>Request Gift Card</h2>
      <div className="completed-gigs">
        <h3>Your Completed Gigs</h3>
        <div className="request-giftcards">
          {completedGigs.length > 0 ? (
            completedGigs.map((gig) => (
              <div className="completedgiftcard" key={gig._id}>
                <h3>{gig.title}</h3>
                <div>Allocated date: {formatDate(gig.allocatedAt)}</div>
                <div>Completed date: {formatDate(gig.completedAt)}</div>

                {gig.paymentStatus !== "requested" && gig.paymentStatus !== "approved" && (
                  <button onClick={() => handleRequestGiftCard(gig._id)} className="request-button" disabled={loading}>
                    {`Request Gift Card of $${gig.budget}`}
                  </button>
                )}

                {gig.paymentStatus === "requested" && <h5>Gift Card sent for approval</h5>}
                {gig.paymentStatus === "approved" && <h5>Gift Card is approved</h5>}
              </div>
            ))
          ) : (
            <p>No completed gigs available</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Message Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{modalMessage}</h2>
        <button onClick={closeModal} className="close-button">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Earnings;