import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyTOTP } from "../Services/Actions/userAction";
import "./TotpPage.css"; // Add a CSS file for styling

const TotpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, totpVerified, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Focus on the first OTP input field on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input field
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move to previous input field
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "Enter") {
      // Handle form submission on Enter key press
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    const otpCode = otp.join("");
    dispatch(verifyTOTP(otpCode));
  };

  useEffect(() => {
    if (isAuthenticated && totpVerified) {
      navigate("/"); // Redirect to home after successful TOTP verification
    }
  }, [isAuthenticated, totpVerified, navigate]);

  return (
    <div className="totp-container">
      <h1>Enter TOTP</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="totp-form">
        <label htmlFor="totp">Enter the 6-digit code:</label>
        <div className="otp-inputs">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-box"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <button className="totpbutton" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TotpPage;
