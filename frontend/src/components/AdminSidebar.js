import React, { useState } from "react";
import "./Sidebar.css"; // Ensure you import the CSS
import { useDispatch } from "react-redux";
import { logout } from "../Services/Actions/userAction";

import {
  FaHome, // Dashboard
  FaBook, // Manage Studies (Book for studies)
  FaUsers, // Manage Users (Users icon for user management)
  FaTasks, // Manage Payout (Tasks icon for payout management)
  FaChartBar, // Analytics
  FaPlusCircle, // Add Gig
  FaHeadset, // Support
  FaSignOutAlt, // Logout
  FaAngleRight,
  FaAngleLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true); // Sidebar open initially

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="logo-details">
        <i className="bx bxl-codepen"></i>
        <div className="logo_name">StudiesHQ</div>
        <i className={`bx bx-menu ${isOpen ? "rotate" : ""}`} id="btn" onClick={toggleSidebar}>
          {isOpen ? <FaAngleLeft id="btn" className="icon" /> : <FaAngleRight id="btn" className="icon" />}
        </i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/admin-dashboard" className="linke">
            <i>
              <FaHome className="icon" />
            </i>

            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/managestudies" className="linke">
            <i>
              <FaBook className="icon" />
            </i>

            <span className="links_name">Manage Studies</span>
          </Link>
          <span className="tooltip">Manage Studies</span>
        </li>
        <li>
          <Link to="/manageuser" className="linke">
            <i>
              <FaUsers className="icon" />
            </i>

            <span className="links_name">Manage Users</span>
          </Link>
          <span className="tooltip">Manage Users</span>
        </li>
        <li>
          <Link to="/managepayout" className="linke">
            <i>
              <FaTasks className="icon" />
            </i>

            <span className="links_name">Manage Payout</span>
          </Link>
          <span className="tooltip">Manage Payout</span>
        </li>
        <li>
          <Link to="/analytics" className="linke">
            <i>
              <FaChartBar className="icon" />
            </i>

            <span className="links_name">Analytics</span>
          </Link>
          <span className="tooltip">Analytics</span>
        </li>
        <li>
          <Link to="/managePdf" className="linke">
            <i>
              <FaBook className="icon" />
            </i>

            <span className="links_name">Manage Contract</span>
          </Link>
          <span className="tooltip">Manage Contract</span>
        </li>
        <li>
          <Link to="/addstudies" className="linke">
            <i>
              {" "}
              <FaPlusCircle className="icon" />
            </i>

            <span className="links_name">Add Study</span>
          </Link>
          <span className="tooltip">Add Study</span>
        </li>

        <li className="profile">
          <div className="profile-details" onClick={handleLogout}>
            <i>
              <FaSignOutAlt className="icon" />
            </i>

            <div className="name_job">
              <div className="name">Logout</div>
            </div>
          </div>
          <i className="bx bx-log-out" id="log_out"></i>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
