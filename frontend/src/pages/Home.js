import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs, applyGig } from "../Services/Actions/gigsActions.js";
import { FaRegSmile, FaRegLightbulb, FaGift } from "react-icons/fa";
import { FacebookShareButton, WhatsappShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./Home.css";
import v1 from "../Assets/videos/3.mp4";
import browse from "../Assets/photos/web-browser.png";
import apply from "../Assets/photos/apply.png";
import complete from "../Assets/photos/complete.png";
import giftcard from "../Assets/photos/giftcard.png";
import easyaccess from "../Assets/photos/easyaccess.png";
import studies from "../Assets/photos/studies.png";
import participation from "../Assets/photos/participation.png";
import rewards from "../Assets/photos/rewards.png";
import calendar from "../Assets/photos/calendar.png";
import share from "../Assets/photos/share3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [expandedGigId, setExpandedGigId] = useState(null);
  const { user } = useSelector((state) => state.user);
  const userId = useSelector((state) => state.user.user._id);
  const [referralLink, setReferralLink] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);

    // Hide the "Copied!" message after 2 seconds
    setTimeout(() => setCopySuccess(false), 2000);
  };

  useEffect(() => {
    dispatch(fetchGigs(userId));
  }, [dispatch]);

  const { gigs, successMessage } = useSelector((state) => ({
    gigs: state.gig.gigs, // Adjust state path as necessary
    successMessage: state.gig.successMessage, // Assuming this is where the success message is stored
  }));

  const handleApply = (gigId) => {
    dispatch(applyGig(gigId))
      .then(() => {
        setMessage("Application submitted successfully!");
      })
      .catch((error) => {
        setMessage("Error applying for the gig. Please try again.");
      });
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleGetStarted = () => {
    navigate("/available-gigs");
  };

  const toggleDescription = (gigId) => {
    setExpandedGigId(expandedGigId === gigId ? null : gigId);
  };

  const referFriend = async (gigId) => {
    console.log(gigId);
    console.log(user._id);
    try {
      const response = await axios.post("aak/l1/generate-link", { gigId, referringUserId: user._id });
      setReferralLink(response.data.referralLink);
      setShowModal(true);
    } catch (error) {
      console.error("Error generating project referral link:", error);
      alert("Failed to generate project referral link.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="home">
      <section className="hero">
        <video autoPlay loop muted className="background-video">
          {/* <source src="https://cdn.pixabay.com/video/2016/05/12/3179-166339018_tiny.mp4" type="video/mp4" /> */}
          <source src={v1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1>Welcome to StudiesHq</h1>
          <p>Apply for studies and earn gift cards</p>
          <button onClick={handleGetStarted}>Get Started</button>
        </div>
      </section>

      <section className="popular-gigs">
        <div className="available-studies">
          <h2>Popular Studies</h2>
          <div className="study-list">
            {gigs && gigs.length > 0 ? (
              gigs.map((gig) => (
                <div key={gig._id} className="homestudy-card">
                  <h3 className="study-title">{gig.title}</h3>

                  {gig.image && (
                    <img
                      src={gig.image.includes("data:image") ? gig.image : `data:image/png;base64,${gig.image}`}
                      alt="Image Preview"
                      className="image-preview"
                    />
                  )}
                  <div className={`study-description ${expandedGigId === gig._id ? "expanded" : ""}`}>
                    {expandedGigId === gig._id
                      ? gig.description
                      : gig.description
                      ? `${gig.description.substring(0, 100)}.`
                      : "No description available"}
                  </div>
                  {gig.description && gig.description.length > 100 && (
                    <button className="read-more-button" onClick={() => toggleDescription(gig._id)}>
                      {expandedGigId === gig._id ? "Read Less" : "Read More"}
                    </button>
                  )}

                  <div className="home-study-details">
                    <span className="study-location">
                      GiftCard <div></div>${gig.budget}
                    </span>
                    <span className="study-date">
                      <img src={calendar} alt="Calendar" className="calendar-icon" /> Last Date<div></div>{" "}
                      {formatDate(gig.deadline)}
                    </span>

                    {/* provide code for this share */}
                    <div className="share-buttons">
                      <button className="share-button" onClick={() => referFriend(gig._id)}>
                        <img src={share} alt="Share" className="share-icon" />
                      </button>
                    </div>
                  </div>
                  {/* Share Button Section */}
                </div>
              ))
            ) : (
              <div>No gigs available</div>
            )}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <img src={browse} alt="Browse Studies" className="step-icon" />
            <h3>1. Browse Studies</h3>
            <p>Find studies that interest you</p>
          </div>
          <div className="step">
            <img src={apply} alt="Apply" className="step-icon" />
            <h3>2. Apply</h3>
            <p>Submit your application</p>
          </div>
          <div className="step">
            <img src={complete} alt="Complete" className="step-icon" />
            <h3>3. Complete the Studies</h3>
            <p>Finish the assigned tasks</p>
          </div>
          <div className="step">
            <img src={giftcard} alt="Earn" className="step-icon" />
            <h3>4. Earn</h3>
            <p>Receive gift cards for completed studies</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Testimonials</h2>
        <div className="testimonial-list">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "StudiesHQ has completely transformed the way I participate in studies. The process is seamless, and I
              love earning gift cards!"
            </p>
            <p className="testimonial-author">- John Doe</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "The variety of studies available is fantastic. I appreciate the ease of use and the rewards for my
              efforts."
            </p>
            <p className="testimonial-author">- Jane Smith</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "Applying for studies and earning rewards has never been easier. StudiesHQ is a game-changer!"
            </p>
            <p className="testimonial-author">- Sarah Lee</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Benefits</h2>
        <ul>
          <li>
            <img src={easyaccess} alt="Easy to access" className="step-icon" />
            <p>Easy to access</p>
          </li>
          <li>
            <img src={studies} alt="Variety of studies" className="step-icon" />
            <p>Variety of studies</p>
          </li>
          <li>
            <img src={rewards} alt="Earn rewards" className="step-icon" />
            <p>Earn rewards</p>
          </li>
          <li>
            <img src={participation} alt="Expert guidance" className="step-icon" />
            <p>Expert guidance</p>
          </li>
        </ul>
      </section>

      <section className="recent-gigs">
        <h2>Recent Studies</h2>
        {/* Add cards for recent gigs here */}
      </section>

      {showModal && (
        <div className="share-modal">
          <div className="share-modal__content">
            <h3>Share this study</h3>
            <p>Share the study with your friends:</p>
            <FacebookShareButton url={referralLink}>
              <button className="share-button-modal facebook">
                <FaFacebook />
              </button>
            </FacebookShareButton>
            <WhatsappShareButton url={referralLink}>
              <button className="share-button-modal whatsapp">
                <FaWhatsapp />
              </button>
            </WhatsappShareButton>
            <LinkedinShareButton url={referralLink}>
              <button className="share-button-modal linkedin">
                <FaLinkedin />
              </button>
            </LinkedinShareButton>
            <TwitterShareButton url={referralLink}>
              <button className="share-button-modal twitter">
                <FaTwitter />
              </button>
            </TwitterShareButton>

            {copySuccess && <p className="copy-success-message">Copied!</p>}

            <button onClick={handleCopyLink} className="share-button copy-link">
              Copy Link
            </button>

            <button onClick={closeModal} className="share-modal__close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
