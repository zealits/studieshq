import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { loadUser } from "./Services/Actions/userAction.js";
import Home from "./pages/Home";
import MyGigs from "./pages/MyGigs";
import AvailableGigs from "./pages/AvailableGigs";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import KnowledgeBank from "./pages/KnowledgeBank";
import Support from "./pages/Support";
import Message from "./pages/Messages";
import PandaLogin from "./pages/PandaLogin";
import Sidebar from "./components/Sidebar";
import AddGig from "./pages/AddGig";
import AdminDashboard from "./pages/AdminDashboard.js";
import Loading from "./components/Loading.js";
import AdminSidebar from "./components/AdminSidebar.js";
import ManageUser from "./Admin/ManageUser.js";
import ManageStudies from "./Admin/ManageStudies.js";
import ManagePayout from "./Admin/ManagePayout.js";
import ManagePdf from "./Admin/ManagePdf.js";
import SuperAdminDashboard from "./superAdmin/SuperAdminDashboard.js";
import SuperAdminSidebar from "./superAdmin/SuperAdminSidebar.js";
import Modal from "react-modal";

import TotpPage from "./components/TotpPage.js";
import TwoFactorAuthPage from "./components/TwoFactorAuthPage.js";
import "./App.css"; // Import the CSS for layout
import axios from "axios";
import CreateContract from "./Admin/CreateContract.js";
import UpdateContract from "./Admin/updateContract.js";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user, totpVerified } = useSelector((state) => state.user);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [showTOTPForm, setShowTOTPForm] = useState(false);

  useEffect(() => {
    dispatch(loadUser()); // Load user data on app load
  }, [dispatch]);

  const handle2FA = async (activate) => {
    if (activate) {
      try {
        // Make an API call to enable 2FA
        const response = await axios.post("/aak/l1/enable-2fa");
        const qrCodeUrl = response.data.qrCodeUrl;

        setQrCodeUrl(qrCodeUrl);
        setShow2FAModal(false); // Close the initial 2FA modal
      } catch (error) {
        console.error("Error enabling 2FA:", error);
        alert("Failed to enable 2FA");
      }
    } else {
      setShow2FAModal(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newCode = verificationCode.split("");
    newCode[index] = value.slice(0, 1);

    setVerificationCode(newCode.join(""));

    // Focus on the next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const [totpCode, setTotpCode] = useState("");

  const handleTOTPChange = (e, index) => {
    const value = e.target.value;
    const newCode = totpCode.split("");
    newCode[index] = value.slice(0, 1);

    setTotpCode(newCode.join(""));

    // Focus on the next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`totp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post("/aak/l1/verify-2fa", { token: totpCode });

      if (response.data.message === "2FA verified successfully") {
        alert("2FA has been successfully enabled!");
        setQrCodeUrl(""); // Close the modal after successful verification
        setShowTOTPForm(false);
        // Update user state to reflect 2FA verification
        // You might need to dispatch an action here to update the user state
      } else {
        setVerificationError("Invalid 2FA code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      setVerificationError("Failed to verify 2FA code. Please try again.");
    }
  };

  if (loading) {
    return <Loading />; // Show loading screen while fetching user data
  }

  // if (isAuthenticated && !loading) {
  //   if (user && user.is2FAEnabled && user.is2FAVerified) {
  //     return (
  //       <Modal
  //         isOpen={showTOTPForm}
  //         onRequestClose={() => setShowTOTPForm(false)}
  //         contentLabel="Enter TOTP"
  //         className="modal"
  //         overlayClassName="overlay"
  //       >
  //         <h2>Enter your TOTP</h2>
  //         <div>
  //           <label htmlFor="totp">Enter the 6-digit TOTP code:</label>
  //           <div className="code-inputs">
  //             {Array.from({ length: 6 }).map((_, index) => (
  //               <input
  //                 key={index}
  //                 id={`totp-${index}`}
  //                 type="text"
  //                 maxLength="1"
  //                 className="code-box"
  //                 onChange={(e) => handleTOTPChange(e, index)}
  //               />
  //             ))}
  //           </div>
  //           {verificationError && <p style={{ color: "red" }}>{verificationError}</p>}
  //           <button onClick={handleVerification}>Submit</button>
  //         </div>
  //         <button onClick={() => setShowTOTPForm(false)}>Close</button>
  //       </Modal>
  //     );
  //   }

  //   if (!user.is2FAEnabled) {
  //     return (
  //       <Modal
  //         isOpen={show2FAModal}
  //         onRequestClose={() => setShow2FAModal(false)}
  //         contentLabel="Activate 2FA"
  //         className="modal"
  //         overlayClassName="overlay"
  //       >
  //         <h2>Activate 2-Factor Authentication</h2>
  //         <p>Would you like to activate 2-Factor Authentication now?</p>
  //         <button onClick={() => handle2FA(true)}>Activate</button>
  //         <button onClick={() => handle2FA(false)}>Maybe Later</button>
  //       </Modal>
  //     );
  //   }
  // }

  return (
    <div className="app">
      <Router>
        {isAuthenticated && totpVerified && user.is2FAEnabled && (
          <>
            {user.role === "admin" && <AdminSidebar />}
            {user.role === "user" && <Sidebar />}
            {user.role === "superadmin" && <SuperAdminSidebar />}
          </>
        )}
        <div className="content">
          <Routes>
            {!isAuthenticated && <Route path="/" element={<PandaLogin />} />}

            {isAuthenticated && !user.is2FAEnabled && <Route path="/" element={<TwoFactorAuthPage />} />}

            {isAuthenticated && !totpVerified && user.is2FAEnabled ? (
              <Route path="/" element={<TotpPage />} />
            ) : (
              isAuthenticated &&
              totpVerified && (
                <>
                  {user.role === "user" && (
                    <>
                      <Route exact path="/" element={<Home />} />
                      <Route path="/my-gigs" element={<MyGigs />} />
                      <Route path="/available-gigs" element={<AvailableGigs />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/earnings" element={<Earnings />} />
                      <Route path="/preferences" element={<Preferences />} />
                      <Route path="/message" element={<Message />} />
                      <Route path="/knowledge-bank" element={<KnowledgeBank />} />
                      <Route path="/support" element={<Support />} />
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <Route exact path="/" element={<AdminDashboard />} />
                      <Route exact path="/manageuser" element={<ManageUser />} />
                      <Route exact path="/managestudies" element={<ManageStudies />} />
                      <Route exact path="/managepayout" element={<ManagePayout />} />
                      <Route exact path="/managePdf" element={<CreateContract />} />
                      <Route path="/addstudies" element={<AddGig />} />
                      <Route path="/analytics" element={<UpdateContract />} />
                    </>
                  )}

                  {user.role === "superadmin" && (
                    <>
                      <Route exact path="/" element={<SuperAdminDashboard />} />
                    </>
                  )}
                </>
              )
            )}

            {/* Redirect to the home page if no matching route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>

      {/* <Router>
        {isAuthenticated && totpVerified && (
          <>
            {user.role === "admin" && <AdminSidebar />}
            {user.role === "user" && <Sidebar />}
            {user.role === "superadmin" && <SuperAdminSidebar />}
          </>
        )}
        <div className="content">
          <Routes>
            {!isAuthenticated && <Route path="/" element={<PandaLogin />} />}
            {isAuthenticated && !totpVerified ? <Route path="/" element={<TotpPage />} /> : null}

            {isAuthenticated && totpVerified ? (
              <>
                {user.role === "user" && (
                  <>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/my-gigs" element={<MyGigs />} />
                    <Route path="/available-gigs" element={<AvailableGigs />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/earnings" element={<Earnings />} />
                    <Route path="/preferences" element={<Preferences />} />
                    <Route path="/message" element={<Message />} />
                    <Route path="/knowledge-bank" element={<KnowledgeBank />} />
                    <Route path="/support" element={<Support />} />
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <Route exact path="/" element={<AdminDashboard />} />
                    <Route exact path="/manageuser" element={<ManageUser />} />
                    <Route exact path="/managestudies" element={<ManageStudies />} />
                    <Route exact path="/managepayout" element={<ManagePayout />} />
                    <Route path="/addstudies" element={<AddGig />} />
                  </>
                )}

                {user.role === "superadmin" && (
                  <>
                    <Route exact path="/" element={<SuperAdminDashboard />} />
                  </>
                )}

                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>

          {qrCodeUrl && (
            <Modal
              isOpen={!!qrCodeUrl}
              onRequestClose={() => setQrCodeUrl("")}
              contentLabel="Scan QR Code"
              className="modal"
              overlayClassName="overlay"
            >
              <h2>Scan this QR Code with your authenticator app</h2>
              <img src={qrCodeUrl} alt="QR Code for 2FA" />
              <div>
                <label htmlFor="code">Enter the 6-digit code:</label>
                <div className="code-inputs">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength="1"
                      className="code-box"
                      onChange={(e) => handleChange(e, index)}
                    />
                  ))}
                </div>
                {verificationError && <p style={{ color: "red" }}>{verificationError}</p>}
                <button onClick={handleVerification}>Verify</button>
              </div>
            </Modal>
          )}
        </div>
      </Router> */}
    </div>
  );
}

export default App;
