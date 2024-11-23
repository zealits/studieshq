import React, { useEffect, useState } from "react";
import "./ManagePayout.css";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUsers } from "../Services/Actions/userAction";
import Loader from "../components/Loading";
import axios from "axios";
import Modal from "react-modal";
import { FaEdit } from "react-icons/fa";

const ManagePayout = () => {
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
        console.log(response.data.data.brands);
        setGiftCardTypes(response.data.data.brands);
      } catch (error) {
        console.error("Error fetching gift card types:", error);
      }
    };

    const fetchGoGiftCards = async () => {
      try {
        console.log("Dfdf");
        const response = await axios.get("aak/l1/admin/gogift/products");
        const titles = response.data.data.products.map((product) => product.title.en);
        console.log(response.data.data.products);
        setGiftCardTypes(response.data.data.products);
        console.log(response.data.data.products[0].title.en);
      } catch (error) {
        console.error("Error fetching gift card types:", error);
      }
    };

    fetchGoGiftCards();
    // fetchGiftCardTypes();
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

  const handleApproveGiftCard = async (userId, gigId, userName, userEmail, budget) => {
    try {
      const giftCardOption = selectedGiftCardOptions[`${userId}-${gigId}`];
      // const budget = editableBudgets[`${userId}-${gigId}`];

      if (!giftCardOption || giftCardOption === "") {
        setPopupMessage("Please select a gift card option before approving.");
        return;
      }
      if (!budget || budget === "") {
        setPopupMessage("Please specify a budget before approving.");
        return;
      }

      console.log("Gift Card Option:", giftCardOption);
      console.log("Budget:", budget);
      console.log("email:", userEmail);
      console.log("userName:", userName);

      // await axios.put(
      //   `aak/l1/admin/gift-card/approve/${userId}/${gigId}`,
      //   { giftCardOption, budget }, // Send the updated budget along with the gift card option
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   }
      // );

      // setPopupMessage(
      //   `Payout request for ${userName} has been approved, and the payout has been sent to ${userEmail}.`
      // );
      // dispatch(loadAllUsers());
    } catch (error) {
      console.error("Error approving gift card:", error);
      setPopupMessage("Failed to approve gift card.");
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
      <h1>Manage Payout</h1>
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
                    <h6>{gig.userSelectedGiftCardOption}</h6>
                    <select
                      className="payment-select"
                      value={
                        selectedGiftCardOptions[`${user._id}-${gig._id}`] ||
                        gig.giftCardOption ||
                        gig.userSelectedGiftCardOption ||
                        ""
                      }
                      onChange={(e) => handleGiftCardOptionChange(user._id, gig._id, e.target.value)}
                    >
                      <option value="">None</option>
                      {/* {giftCardTypes.map((type) => (
                        <option key={type.brand_code} value={type.brand_code}>
                          {type.name}
                        </option>
                      ))} */}

                      {giftCardTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title.en}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    {gig.paymentStatus === "requested" && (
                      <button
                        className="btn btn-info"
                        onClick={() => handleApproveGiftCard(user._id, gig._id, user.name, user.email, gig.budget)}
                      >
                        Approve ${editableBudgets[`${user._id}-${gig._id}`] || gig.budget}
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

export default ManagePayout;
