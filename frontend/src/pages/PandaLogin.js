import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, register } from "../Services/Actions/userAction.js";
import "./PandaLogin.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const PandaLogin = () => {
  const navigate = useNavigate();

  // const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [rePassword, setRePassword] = useState(/"");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // To track if OTP is sent
  const [emailVerified, setEmailVerified] = useState(false); // To track if email is verified
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState({ name: "", iso: "" });
  const [currency, setCurrency] = useState({ name: "", iso: "" });
  const [languages, setLanguages] = useState([{ name: "", proficiency: "" }]);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const sendOtpToEmail = () => {
    fetch("/aak/l1/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOtpSent(true);
          setPopupMessage("OTP has been sent to your email.");
        } else {
          setPopupMessage(data.message || "Failed to send OTP.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const verifyOtp = () => {
    fetch("/aak/l1/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEmailVerified(true);
          setPopupMessage("Email verified successfully.");
        } else {
          setPopupMessage(data.message || "Invalid OTP.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const dispatch = useDispatch();

  const handleToggle = () => {
    setSignUp(!signUp);
    animateFields(signUp ? "login" : "signup");
  };

  const animateFields = (form) => {
    // Animation logic here
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signUp) {
      if (password !== rePassword) {
        alert("Passwords do not match");
        return;
      }

      const referringUserId = localStorage.getItem("referringUserId");
      const referredStudyId = localStorage.getItem("referredStudyId");

      const userData = {
        firstName,
        lastName,
        email,
        password,
        gender,
        languages,
        dateOfBirth,
        country: country.name,
        countryIso: country.iso,   
        currency: currency.name,
        currencyIso: currency.iso,
        referralId: referringUserId || null,
        studyId: referredStudyId || null,
      };
      console.log(userData);

      dispatch(register(userData)).then(() => {
        setPopupMessage("Registration successful!");

        // Clear local storage items
        localStorage.removeItem("referringUserId");
        localStorage.removeItem("referredStudyId");

        // Redirect to /invited-study if referredStudyId exists
        if (referredStudyId) {
          navigate("/invited-study");

          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
    } else {
      const referralId = localStorage.getItem("referringUserId");
      const studyId = localStorage.getItem("referredStudyId");

      dispatch(login(loginName, loginPassword, referralId || null, studyId || null)).then(() => {
        setPopupMessage("Login successful!");

        localStorage.removeItem("referringUserId");
        localStorage.removeItem("referredStudyId");

        if (referralId) {
          navigate("/invited-study");

          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
    }
  };

  // Inside PandaLogin component render
  return (
    <div className="loginpage">
      {!signUp ? (
        <Login
          loginName={loginName}
          loginPassword={loginPassword}
          setLoginName={setLoginName}
          setLoginPassword={setLoginPassword}
          handleToggle={handleToggle}
          handleSubmit={handleSubmit}
        />
      ) : (
        <SignUp
          email={email}
          otp={otp}
          otpSent={otpSent}
          emailVerified={emailVerified}
          setEmail={setEmail}
          setOtp={setOtp}
          sendOtpToEmail={sendOtpToEmail}
          verifyOtp={verifyOtp}
          firstName={firstName}
          lastName={lastName}
          languages={languages}
          setLanguages={setLanguages}
          password={password}
          rePassword={rePassword}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPassword={setPassword}
          setRePassword={setRePassword}
          gender={gender} // Add gender prop
          setGender={setGender} // Add setGender prop
          country={country} // Add country prop
          setCountry={setCountry} // Add setCountry prop
          setCurrency={setCurrency} // Add setCountry prop
          dateOfBirth={dateOfBirth} // Add dateOfBirth prop
          setDateOfBirth={setDateOfBirth} // Add setDateOfBirth prop
          handleToggle={handleToggle}
          handleSubmit={handleSubmit}
        />
      )}

      <Modal
        isOpen={!!popupMessage}
        onRequestClose={() => setPopupMessage("")}
        className="unique-popup-modal"
        overlayClassName="unique-popup-overlay"
      >
        <div className="unique-popup-content">
          <h2 className="unique-popup-title">Notification</h2>
          <p className="unique-popup-message">{popupMessage}</p>
          <button className="unique-popup-close-btn" onClick={() => setPopupMessage("")}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

const Login = ({ loginName, loginPassword, setLoginName, setLoginPassword, handleToggle, handleSubmit }) => (
  <div className="login">
    <h1>Log In</h1>
    <hr />
    <form onSubmit={handleSubmit}>
      <Input label="User Name (email)" type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
      <Input
        label="Password"
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <Submit />
    </form>
    <SignupLink handleToggle={handleToggle} />
  </div>
);

const SignUp = ({
  email,
  otp,
  otpSent,
  emailVerified,
  setEmail,
  setOtp,
  sendOtpToEmail,
  verifyOtp,
  firstName,
  lastName,
  password,
  rePassword,
  setFirstName,
  setLastName,
  setPassword,
  setRePassword,
  gender,
  setGender,
  country,
  currency,
  setCurrency,
  setCountry,
  languages,
  setLanguages,
  handleToggle,
  handleSubmit,
  dateOfBirth,
  setDateOfBirth, // Added setter for dateOfBirth
}) => {
  // Handler to add a new language
  const addLanguage = () => setLanguages([...languages, { name: "", proficiency: "" }]);

  // Handler to remove a language entry
  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  // Handler to update language entry
  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = languages.map((language, i) => (i === index ? { ...language, [field]: value } : language));
    setLanguages(updatedLanguages);
  };

  // UseEffect to log languages when it changes
  useEffect(() => {
    console.log("Languages state updated:", languages);
  }, [languages]);

  const countries = [
    { country: "United States", iso: "US" },
    { country: "India", iso: "IN" },
    { country: "Iceland", iso: "IS" },
    { country: "Iran", iso: "IR" },
    { country: "Nigeria", iso: "NG" },
    { country: "Sri Lanka", iso: "LK" },
    { country: "Ethiopia", iso: "ET" },
    { country: "Myanmar", iso: "MM" },
    { country: "Nepal", iso: "NP" },
    { country: "Azerbaijan", iso: "AZ" },
    { country: "Armenia", iso: "AM" },
    { country: "Cambodia", iso: "KH" },
    { country: "Spain (Galicia)", iso: "ES" },
    { country: "Laos", iso: "LA" },
    { country: "Spain (Basque Country)", iso: "ES" },
    { country: "Indonesia", iso: "ID" },
    { country: "Uzbekistan", iso: "UZ" },
    { country: "Mongolia", iso: "MN" },
    { country: "North Macedonia", iso: "MK" },
    { country: "South Africa", iso: "ZA" },
    { country: "Rwanda", iso: "RW" },
  ];

  // Currency data with ISO codes
  const currencies = [
    { currency: "USD", iso: "USD" },
    { currency: "INR", iso: "INR" },
    { currency: "ISK", iso: "ISK" },
    { currency: "IRR", iso: "IRR" },
    { currency: "NGN", iso: "NGN" },
    { currency: "LKR", iso: "LKR" },
    { currency: "ETB", iso: "ETB" },
    { currency: "MMK", iso: "MMK" },
    { currency: "NPR", iso: "NPR" },
    { currency: "AZN", iso: "AZN" },
    { currency: "AMD", iso: "AMD" },
    { currency: "KHR", iso: "KHR" },
    { currency: "EUR", iso: "EUR" },
    { currency: "LAK", iso: "LAK" },
    { currency: "IDR", iso: "IDR" },
    { currency: "UZS", iso: "UZS" },
    { currency: "MNT", iso: "MNT" },
    { currency: "MKD", iso: "MKD" },
    { currency: "ZAR", iso: "ZAR" },
    { currency: "RWF", iso: "RWF" },
  ];

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <hr />
      {!emailVerified ? (
        <>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {otpSent ? (
            <>
              <Input label="Enter OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button className="submit-button" type="button" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          ) : (
            <button className="submit-button" type="button" onClick={sendOtpToEmail}>
              Send OTP
            </button>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="sign-up-form">
          {/* First Name and Last Name in one row */}
          <div className="sign-up-row">
            <div className="sign-up-field-firstname">
              <label className="sign-up-label">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="sign-up-input-firstname"
              />
            </div>
            <div className="sign-up-field-lastname">
              <label className="sign-up-label">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="sign-up-input-lastname"
              />
            </div>
          </div>

          {/* Gender, Country, and Date of Birth in one row */}
          <div className="sign-up-row">
            <div className="sign-up-field-gender">
              <label className="sign-up-label">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="sign-up-select-gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="sign-up-field-country">
              <label className="sign-up-label">Country</label>
              <select
                value={country.name}
                onChange={(e) => {
                  const selectedCountry = countries.find((item) => item.country === e.target.value);
                  setCountry({
                    name: selectedCountry?.country || "",
                    iso: selectedCountry?.iso || "",
                  });
                }}
                className="sign-up-select-country"
              >
                <option value="">Select Country</option>
                {countries.map((item) => (
                  <option key={item.iso} value={item.country}>
                    {item.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="sign-up-field-currency">
              <label className="sign-up-label">Currency</label>
              <select
                value={currency?.name || ""} // Safely access `currency.name`
                onChange={(e) => {
                  const selectedCurrency = currencies.find((item) => item.currency === e.target.value);
                  setCurrency({
                    name: selectedCurrency?.currency || "",
                    iso: selectedCurrency?.iso || "",
                  });
                }}
                className="sign-up-select-currency"
              >
                <option value="">Select Currency</option>
                {currencies.map((item) => (
                  <option key={item.iso} value={item.currency}>
                    {item.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="sign-up-field-dob">
              <label className="sign-up-label">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="sign-up-input-dob"
              />
            </div>
          </div>

          {/* Languages Section */}
          <div className="sign-up-field-languages">
            <label className="sign-up-label">Languages</label>
            {languages.map((language, index) => (
              <div key={index} className="sign-up-language-container">
                <input
                  type="text"
                  placeholder="Language, e.g., English"
                  className="sign-up-input-language-name"
                  value={language.name}
                  onChange={(e) => handleLanguageChange(index, "name", e.target.value)}
                />
                <select
                  className="sign-up-select-proficiency"
                  value={language.proficiency}
                  onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)}
                >
                  <option value="">Proficiency</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="fluent">Fluent</option>
                </select>
                {languages.length > 1 && (
                  <span className="sign-up-remove-language-btn" onClick={() => removeLanguage(index)}>
                    ×
                  </span>
                )}
              </div>
            ))}
            <button type="button" className="sign-up-btn-add-language" onClick={addLanguage}>
              + Add Language
            </button>
          </div>

          {/* Password and Re-enter Password in one row */}
          <div className="sign-up-row">
            <div className="sign-up-field-password">
              <label className="sign-up-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sign-up-input-password"
              />
            </div>
            <div className="sign-up-field-repassword">
              <label className="sign-up-label">Re-Enter Password</label>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="sign-up-input-repassword"
              />
            </div>
          </div>

          <button type="submit" className="sign-up-btn-submit">
            Sign Up
          </button>
        </form>
      )}
      <button type="button" className="sign-up-link-toggle" onClick={handleToggle}>
        Already have an account? Login
      </button>
    </div>
  );
};

const Input = ({ label, type, value, onChange }) => (
  <div className="field">
    <label className="label">{label}</label>
    <br />
    <input className="input" type={type} value={value} onChange={onChange} />
  </div>
);

const Submit = () => (
  <div>
    <hr />
    <button className="submit-button" type="submit">
      Submit
    </button>
  </div>
);

const SignupLink = ({ handleToggle }) => (
  <div className="signup-link">
    <p className="in-out">
      Don't have an account?{" "}
      <a href="#" onClick={handleToggle}>
        Sign Up Here
      </a>
    </p>
  </div>
);

const LoginLink = ({ handleToggle }) => (
  <div className="signup-link">
    <p className="in-out">
      Already have an account?{" "}
      <a href="#" onClick={handleToggle}>
        Log In Here
      </a>
    </p>
  </div>
);

export default PandaLogin;
