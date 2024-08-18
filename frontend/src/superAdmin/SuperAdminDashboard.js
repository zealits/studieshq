import React, { useEffect, useState } from "react";
// import "./ManagePayout.css";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUsers } from "../Services/Actions/userAction";
import Loader from "../components/Loading";
import axios from "axios";
import Modal from "react-modal";
import { FaEdit } from "react-icons/fa";
// import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedGiftCardOptions, setSelectedGiftCardOptions] = useState({});
  const [giftCardTypes, setGiftCardTypes] = useState([]);
  const [editableBudgets, setEditableBudgets] = useState({});
  const [editingBudget, setEditingBudget] = useState({}); // Store editing states

  useEffect(() => {
    dispatch(loadAllUsers());

    const fetchGiftCardTypes = async () => {
      try {
        const response = await axios.get("aak/l1/admin/gift-card/types", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGiftCardTypes(response.data.data.brands);
      } catch (error) {
        console.error("Error fetching gift card types:", error);
      }
    };

    fetchGiftCardTypes();
  }, [dispatch]);

  const handleGiftCardOptionChange = (userId, gigId, value) => {
    setSelectedGiftCardOptions((prevOptions) => ({
      ...prevOptions,
      [`${userId}-${gigId}`]: value,
    }));
  };

  const handleSendEmail = async () => {
    if (!email) {
      setPopupMessage("Please enter an email address.");
      return;
    }

    try {
      const styles = `
        <style>
          .user-payout-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
        </style>
      `;

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

      setPopupMessage(`Table data sent successfully to ${email}`);
    } catch (error) {
      setPopupMessage("Failed to send table data.");
    }
  };

  // const handleApproveGiftCard = async (userId, gigId, userName, userEmail) => {
  //   try {
  //     const giftCardOption = selectedGiftCardOptions[`${userId}-${gigId}`];
  //     const budget = editableBudgets[`${userId}-${gigId}`];

  //     if (!giftCardOption || giftCardOption === "") {
  //       setPopupMessage("Please select a gift card option before approving.");
  //       return;
  //     }

  //     await axios.put(
  //       `aak/l1/admin/gift-card/approve/${userId}/${gigId}`,
  //       { giftCardOption, budget }, // Send the updated budget along with the gift card option
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     setPopupMessage(
  //       `Payout request for ${userName} has been approved, and the payout has been sent to ${userEmail}.`
  //     );
  //     dispatch(loadAllUsers());
  //   } catch (error) {
  //     console.error("Error approving gift card:", error);
  //     setPopupMessage("Failed to approve gift card.");
  //   }
  // };

  const handleApproveGiftCard = async (userId, gigId, userName, userEmail, budget) => {
    try {
      console.log("i have clicked");

      const giftCardOption = selectedGiftCardOptions[`${userId}-${gigId}`];
      // const budget = editableBudgets[`${userId}-${gigId}`];

      if (!giftCardOption || giftCardOption === "") {
        setPopupMessage("Please select a gift card option before approving.");
        return;
      }

      // Construct the payload
      const payload = {
        gift_template: "this_will_not_work_you_know_why", // Using the selected gift card option as the template ID
        subject: "This gift card is sent through frontend", // Adjust the subject as needed
        contacts: [
          {
            firstname: userName, // Use the user's name for both firstname and lastname
            lastname: userName,
            email: userEmail,
          },
        ],
        price_in_cents: budget * 100, // Assuming budget is in dollars, convert to cents
        brand_codes: [giftCardOption], // Replace with actual brand codes
        message: "Thank you for your hard work!", // Customize the message
        expiry: "2024-12-31", // Set the expiry date as needed
      };

      await axios.post(
        `/aak/l1/admin/gift-card/send/${userId}/${gigId}`,
        payload, // Send the payload
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPopupMessage("Gift card Send successfully!");
    } catch (error) {
      console.error("Error Sending gift card:", error);
      setPopupMessage("Failed to Send gift card. Please try again.");
    }
  };

  const handleBudgetEdit = (userId, gigId) => {
    setEditingBudget({ userId, gigId });
    setSelectedGiftCardOptions((prevOptions) => ({
      ...prevOptions,
      [`${userId}-${gigId}`]: users.find((user) => user._id === userId).gigs.find((gig) => gig._id === gigId).budget,
    }));
  };

  const handleBudgetChange = (e, userId, gigId) => {
    const newBudget = e.target.value;

    // Update the state with the new budget value, even if it's an empty string
    setSelectedGiftCardOptions((prevOptions) => ({
      ...prevOptions,
      [`${userId}-${gigId}`]: newBudget,
    }));
  };

  const handleBudgetSave = async (userId, gigId) => {
    try {
      const newBudget = selectedGiftCardOptions[`${userId}-${gigId}`];
      await axios.put(
        `aak/l1/admin/gig/budget/${userId}/${gigId}`,
        { budget: newBudget },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingBudget({}); // Reset the editing state after saving
      setPopupMessage(`Budget updated successfully for the gig.`);
      dispatch(loadAllUsers());
    } catch (error) {
      console.error("Error updating budget:", error);
      setPopupMessage("Failed to update budget.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="manage-user-payout">
      {loading && <Loader />}
      <h1>Manage GiftCard</h1>
      {users && users.length > 0 ? (
        <table className="user-payout-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Study Title</th>
              <th>Study Status</th>
              <th>Payment Status</th>
              <th>Budget</th>
              <th>Payout Option</th>
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
                    {editingBudget.userId === user._id && editingBudget.gigId === gig._id ? (
                      <>
                        <input
                          type="number"
                          value={selectedGiftCardOptions[`${user._id}-${gig._id}`] || ""}
                          onChange={(e) => handleBudgetChange(e, user._id, gig._id)}
                        />
                        <button className="btn btn-info" onClick={() => handleBudgetSave(user._id, gig._id)}>
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        ${gig.budget}{" "}
                        <FaEdit className="edit-icon" onClick={() => handleBudgetEdit(user._id, gig._id)} />
                      </>
                    )}
                  </td>

                  <td>
                    <select
                      className="payment-select"
                      value={selectedGiftCardOptions[`${user._id}-${gig._id}`] || gig.giftCardOption || ""}
                      onChange={(e) => handleGiftCardOptionChange(user._id, gig._id, e.target.value)}
                    >
                      <option value="">None</option>
                      {giftCardTypes.map((type) => (
                        <option key={type.brand_code} value={type.brand_code}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    {gig.paymentStatus === "approved" && (
                      <button
                        className="btn btn-info"
                        onClick={() => handleApproveGiftCard(user._id, gig._id, user.name, user.email, gig.budget)}
                      >
                        Send ${editableBudgets[`${user._id}-${gig._id}`] || gig.budget}
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
      <div className="sendmail">
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

      <Modal
        isOpen={!!popupMessage}
        onRequestClose={() => setPopupMessage("")}
        className="popup-modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
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

export default SuperAdminDashboard;
