import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enable2FA, verifyTOTP, clearErrors } from "../Services/Actions/userAction";
import "./TwoFactorAuthPage.css";

const TwoFactorAuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { qrCodeUrl, error } = useSelector((state) => state.auth);
  const { totpVerified } = useSelector((state) => state.user);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Fetch QR Code on component mount
  useEffect(() => {
    dispatch(enable2FA());

    // Focus on the first OTP input field on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [dispatch]);

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

  const handleSubmit = () => {
    const otpCode = otp.join("");

    dispatch(verifyTOTP(otpCode))
      .then(() => {
        // Reload the page after successful dispatch
        window.location.reload();
      })
      .catch((error) => {
        console.error("Verification failed:", error);
        // Optionally handle errors here
      });
  };

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <div className="two-factor-auth">
      <h2>Scan this QR Code with your authenticator app</h2>
      {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code for 2FA" /> : <p>Loading QR Code...</p>}
      <div>
        <label htmlFor="code">Enter the 6-digit code:</label>
        <div className="code-inputs">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="code-box"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="twoFautButt"onClick={handleSubmit}>Verify</button>
      </div>
    </div>
  );
};

export default TwoFactorAuthPage;
