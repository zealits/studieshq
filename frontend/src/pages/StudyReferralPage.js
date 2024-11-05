import React from "react";
import "./StudyRefrralPage.css";

const StudyReferralPage = () => {
  const studyData = {
    title: "New York, NY, 90 min User Study",
    description:
      "We are collecting health, heart rate, fitness, and motion data for a research project. Additionally, we are analyzing user experience and device interaction feedback.",
    giftCard: "$1000",
    lastDate: "15-12-2024",
  };

  return (
    <section className="study-referral-page">
      <div className="referral-header">
        <h2>{studyData.title}</h2>
        <span className="gift-card">Gift Card: {studyData.giftCard}</span>
      </div>
      <p className="description">{studyData.description}</p>
      <div className="details">
        <span className="last-date">
          <strong>Last Date:</strong> {studyData.lastDate}
        </span>
      </div>
      <button className="apply-button">Apply Now</button>
    </section>
  );
};

export default StudyReferralPage;
