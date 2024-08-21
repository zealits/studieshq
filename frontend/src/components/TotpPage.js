import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyTOTP } from "../Services/Actions/userAction";

const TotpPage = () => {
  const [totp, setTotp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, totpVerified } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyTOTP(totp));
  };

  if (isAuthenticated && totpVerified) {
    navigate("/"); // Redirect to home after successful TOTP verification
  }

  return (
    <div className="totp-container">
      <h1>Enter TOTP</h1>
      {/* {error && <p className="error">{error}</p>} */}
      <form onSubmit={handleSubmit} className="totp-form">
        <label htmlFor="totp">
          TOTP Code:
          <input
            type="text"
            id="totp"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            maxLength="6"
            pattern="\d{6}"
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TotpPage;
