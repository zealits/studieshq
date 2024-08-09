import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
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

import "./App.css"; // Import the CSS for layout

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser()); // Load user data on app load
  }, [dispatch]);

  if (loading) {
    return <Loading />; // Show loading screen while fetching user data
  }

  return (
    <div className="app">
      <Router>
        {isAuthenticated && (user.role === "admin" ? <AdminSidebar /> : <Sidebar />)}
        <div className="content">
          <Routes>
            {/* Public Route */}
            {!isAuthenticated && <Route path="/" element={<PandaLogin />} />}

            {/* Authenticated Routes */}
            {isAuthenticated ? (
              <>
                {/* Route for regular users */}
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

                {/* Route for admin users */}
                {user.role === "admin" && (
                  <>
                    <Route exact path="/" element={<AdminDashboard />} />
                    <Route exact path="/manageuser" element={<ManageUser />} />
                    <Route exact path="/managestudies" element={<ManageStudies />} />
                    <Route exact path="/managepayout" element={<ManagePayout />} />
                    <Route path="/addstudies" element={<AddGig />} />
                  </>
                )}

                {/* Redirect to home if user role does not match any route */}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              // Redirect to login page if not authenticated
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
