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
  const [country, setCountry] = useState("");
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
        country,
        languages,
        dateOfBirth,
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
          dateOfBirth={dateOfBirth} // Add dateOfBirth prop
          setDateOfBirth={setDateOfBirth} // Add setDateOfBirth prop
          handleToggle={handleToggle}
          handleSubmit={handleSubmit}
        />
      )}

      <Modal
        isOpen={!!popupMessage}
        onRequestClose={() => setPopupMessage("")}
        className="popup"
        overlayClassName="overlay"
      >
        <div>
          <h2>Notification</h2>
          <p>{popupMessage}</p>
          <button className="btn btn-info" onClick={() => setPopupMessage("")}>
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
      <Input label="User Name" type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
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
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="sign-up-select-country">
                <option value="">Select Country</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="Iceland">Iceland</option>
                <option value="Iran">Iran</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Nepal">Nepal</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Armenia">Armenia</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Spain (Galicia)">Spain (Galicia)</option>
                <option value="Laos">Laos</option>
                <option value="Spain (Basque Country)">Spain (Basque Country)</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Mongolia">Mongolia</option>
                <option value="North Macedonia">North Macedonia</option>
                <option value="South Africa">South Africa</option>
                <option value="Rwanda">Rwanda</option>
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
