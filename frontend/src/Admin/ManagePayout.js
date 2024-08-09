import React, { useEffect, useState } from "react";
import "./ManagePayout.css";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUsers } from "../Services/Actions/userAction"; // Adjust the path based on your project structure
import Loader from "../components/Loading"; // A loader component if you have one
import axios from "axios"; // You need to install axios if you haven't

const ManagePayout = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin); // Assuming adminReducer is used for state management
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(loadAllUsers());
  }, [dispatch]);

  const handleSendEmail = async () => {
    if (!email) {
      alert("Please enter an email address.");
      return;
    }

    try {
      // Inline styles
      const styles = `
        <style>
          .user-payout-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .user-payout-table th, .user-payout-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .user-payout-table th {
            background-color: #f4f4f4;
            color: #333;
          }
          .user-payout-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .user-payout-table tbody tr:hover {
            background-color: #f1f1f1;
          }
          .status-requested {
            color: #ff9800; /* Orange color for 'requested' status */
            background-color: #fff3e0; /* Light orange background */
          }
          .status-approved {
            color: #4caf50; /* Green color for 'approved' status */
            background-color: #e8f5e9; /* Light green background */
          }
          .status-not-requested {
            color: #9e9e9e; /* Gray color for 'not requested' status */
            background-color: #e0e0e0; /* Light gray background */
          }
          .payment-select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #fff;
          }
          .btn-info {
            background-color: #007bff; /* Blue color for the button */
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .btn-info:hover {
            background-color: #0056b3; /* Darker blue on hover */
          }
          .btn-info:disabled {
            background-color: #ccc; /* Gray color for disabled button */
            cursor: not-allowed;
          }
        </style>
      `;

      // Get table HTML
      const tableDataHtml = document.querySelector(".user-payout-table").outerHTML;
      const emailBody = `${styles}<div>${tableDataHtml}</div>`;

      await axios.post(
        "aak/l1/send-email",
        { email, tableData: emailBody },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Table data sent successfully to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send table data.");
    }
  };

  // Function to handle gift card approval
  const handleApproveGiftCard = async (userId, gigId) => {
    try {
      await axios.put(
        `aak/l1/admin/gift-card/approve/${userId}/${gigId}`,
        {},
        {
          headers: {
            // Include any required headers, such as Authorization
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example, adjust as needed
          },
        }
      );
      alert("Gift card approved successfully!");
      // Optionally, dispatch an action to reload users or update the state
      dispatch(loadAllUsers());
    } catch (error) {
      console.error("Error approving gift card:", error);
      alert("Failed to approve gift card.");
    }
  };

  return (
    <div className="manage-user-payout">
      {loading && <Loader />}
      <h1>Manage Payout</h1>
      {users && users.length > 0 ? (
        <table className="user-payout-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Study Title</th>
              <th>Budget</th>
              <th>Study Status</th>
              <th>Payment Status</th>
              <th>Gift Card Option</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.flatMap((user) =>
              user.gigs.map((gig, index) => (
                <tr key={`${user._id}-${gig._id}`}>
                  {index === 0 && (
                    <>
                      <td rowSpan={user.gigs.length}>{user.name}</td>
                      <td rowSpan={user.gigs.length}>{user.email}</td>
                    </>
                  )}
                  <td>{gig.title}</td>

                  <td>${gig.budget}</td>
                  <td>{gig.status}</td>
                  <td
                    className={
                      gig.paymentStatus === "requested"
                        ? "status-requested"
                        : gig.paymentStatus === "approved"
                        ? "status-approved"
                        : "status-not-requested"
                    }
                  >
                    {gig.paymentStatus}
                  </td>

                  <td>
                    <select className="payment-select">
                      <option value="">None</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">MasterCard</option>
                    </select>
                  </td>
                  <td>
                    {gig.paymentStatus !== "approved" && (
                      <button className="btn btn-info" onClick={() => handleApproveGiftCard(user._id, gig._id)}>
                        Approve ${gig.budget}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
      <div>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-info" onClick={handleSendEmail}>
          Send Table Data
        </button>
      </div>
      {/* add here field so admin take email address send button after click on that button all the data in table will send to specfic email address in form of table as it is in table so i will need to make backend route and api in usercontroller for that as well */}
    </div>
  );
};

export default ManagePayout;
