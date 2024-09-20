import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, register } from "../Services/Actions/userAction.js";
import "./PandaLogin.css";
import Modal from "react-modal";

const PandaLogin = () => {
  // const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [rePassword, setRePassword] = useState(/"");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);

  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // To track if OTP is sent
  const [emailVerified, setEmailVerified] = useState(false); // To track if email is verified
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const sendOtpToEmail = () => {
    // Call the backend API to send OTP
    fetch("/aak/l1/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOtpSent(true);
          alert("OTP has been sent to your email.");
        } else {
          alert(data.message || "Failed to send OTP.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const verifyOtp = () => {
    // Call the backend API to verify OTP
    fetch("/aak/l1/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEmailVerified(true);
          alert("Email verified successfully.");
        } else {
          alert(data.message || "Invalid OTP.");
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
      const userData = { firstName, lastName, email, password };
      // console.log(userData);
      dispatch(register(userData)).then(() => {
        alert("Registration successful!");
      });
    } else {
      dispatch(login(loginName, loginPassword)).then(() => {
        alert("Login successful!");
      });
    }
  };

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
          password={password}
          rePassword={rePassword}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPassword={setPassword}
          setRePassword={setRePassword}
          handleToggle={handleToggle}
          handleSubmit={handleSubmit}
        />
      )}
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
  handleToggle,
  handleSubmit,
}) => (
  <div className="sign-up">
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
      <form onSubmit={handleSubmit}>
        <Input label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input
          label="Re-Enter Password"
          type="password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
        <Submit />
      </form>
    )}
    <LoginLink handleToggle={handleToggle} />
  </div>
);

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
