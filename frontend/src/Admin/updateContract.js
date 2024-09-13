import React, { useState } from "react";
import axios from "axios"; // Make sure to install axios using npm or yarn

const UpdateContract = () => {
  // State to hold contract ID and new details
  const [contractId, setContractId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior

    try {
      // Send a PUT request to update the contract by ID
      const response = await axios.put(`/aak/l1/contracts/${contractId}`, { email, contractId });

      // Display success message
      setMessage(response.data.message);
    } catch (error) {
      // Handle errors (e.g., show an error message)
      setMessage(error.response ? error.response.data.message : "An error occurred while updating the contract.");
    }
  };

  return (
    <div>
      <h2>Update Contract</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="contractId">Contract ID:</label>
          <input
            type="text"
            id="contractId"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">New Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit">Update Contract</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateContract;
