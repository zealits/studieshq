import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, register } from "../Services/Actions/userAction.js";
import "./PandaLogin.css";
import Modal from "react-modal";

const PandaLogin = () => {
  const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false); // State to control modal visibility

  const [emailVerified, setEmailVerified] = useState(false);
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [emailVerificationInProgress, setEmailVerificationInProgress] = useState(false);


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
      const userData = { name, email, password };
      dispatch(register(userData)).then(() => {
      
      });
    } else {
      dispatch(login(loginName, loginPassword)).then(() => {
      
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
          name={name}
          email={email}
          password={password}
          rePassword={rePassword}
          setName={setName}
          setEmail={setEmail}
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
  name,
  email,
  password,
  rePassword,
  setName,
  setEmail,
  setPassword,
  setRePassword,
  handleToggle,
  handleSubmit,
}) => (
  <div className="sign-up">
    <h1>Sign Up</h1>
    <hr />
    <form onSubmit={handleSubmit}>
      <Input label="User Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input
        label="Re-Enter Password"
        type="password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
      />
      <Submit />
    </form>
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
