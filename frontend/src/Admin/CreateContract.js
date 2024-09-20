import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import "./CreateContract.css";

const CreateContract = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    userId: "", // Example: Replace with the actual user ID from your app's state or context
    jobTitle: "",
    projectDetails: "",
    freelanceStudyDetails: "",
    signature: "",
    filename: "", // New field to store the filename
  });

  const [contracts, setContracts] = useState([]);

  // Ref to manage the signature canvas
  const sigCanvas = useRef({});

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle digital signature
  const handleClearSignature = () => {
    sigCanvas.current.clear();
    setFormData({ ...formData, signature: "" });
  };

  const handleSaveSignature = () => {
    // Save the signature as a base64 string
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setFormData({ ...formData, signature });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the filename ends with .pdf
    const filename = formData.filename.endsWith(".pdf") ? formData.filename : `${formData.filename}.pdf`;
    const updatedFormData = { ...formData, filename };

    try {
      // Send form data to backend
      const response = await axios.post("/aak/l1/contracts", updatedFormData);
      console.log("Contract created successfully:", response.data);
      alert("Contract created successfully!");

      fetchContracts();
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract. Please try again.");
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await axios.get("/aak/l1/contracts");
      console.log(response);
      setContracts(response.data); // Assuming response.data is an array of contracts
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Convert byte array to base64 string
  const byteArrayToBase64 = (byteArray) => {
    let binary = "";
    const bytes = new Uint8Array(byteArray);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    console.log(btoa(binary));
    return window.btoa(binary);
  };

  return (
    <div>
      <div className="create-contract-container">
        <h2 className="create-contract-title">Create Contract</h2>
        <form className="create-contract-form" onSubmit={handleSubmit}>
          <div className="create-contract-field">
            <label htmlFor="userId" className="create-contract-label">
              User ID:
            </label>
            <input
              id="userId"
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>
          <div className="create-contract-field">
            <label htmlFor="jobTitle" className="create-contract-label">
              Job Title:
            </label>
            <input
              id="jobTitle"
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>
          <div className="create-contract-field">
            <label htmlFor="projectDetails" className="create-contract-label">
              Project Details:
            </label>
            <textarea
              id="projectDetails"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
              required
              className="create-contract-textarea"
            />
          </div>
          <div className="create-contract-field">
            <label htmlFor="freelanceStudyDetails" className="create-contract-label">
              Freelance Study Details:
            </label>
            <textarea
              id="freelanceStudyDetails"
              name="freelanceStudyDetails"
              value={formData.freelanceStudyDetails}
              onChange={handleChange}
              className="create-contract-textarea"
            />
          </div>
          <div className="create-contract-field">
            <label htmlFor="filename" className="create-contract-label">
              Filename:
            </label>
            <input
              id="filename"
              type="text"
              name="filename"
              value={formData.filename}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>
          {/* Uncomment and use SignatureCanvas if required */}
          {/* <div className="create-contract-signature">
            <label className="create-contract-label">Signature:</label>
            <SignatureCanvas
              penColor="blue"
              canvasProps={{ width: 300, height: 200, className: "create-contract-signatureCanvas" }}
              ref={sigCanvas}
            />
            <div className="create-contract-signature-buttons">
              <button type="button" className="create-contract-save-button" onClick={handleSaveSignature}>
                Save Signature
              </button>
              <button type="button" className="create-contract-clear-button" onClick={handleClearSignature}>
                Clear Signature
              </button>
            </div>
          </div> */}
          <button type="submit" className="create-contract-submit-button">
            Create Contract
          </button>
        </form>
      </div>
      <div className="contracts-list">
        {contracts.map((contract) => {
          const base64Data = contract.pdfData.data ? byteArrayToBase64(contract.pdfData.data) : "";

          return (
            <div key={contract._id} className="contract-item">
              <p>
                <strong>User ID:</strong> {contract.userId}
              </p>
              <p>
                <strong>Job Title:</strong> {contract.jobTitle}
              </p>
              <p>
                <strong>Project Details:</strong> {contract.projectDetails}
              </p>
              <p>
                <strong>Freelance Study Details:</strong> {contract.freelanceStudyDetails}
              </p>
              <p>
                <strong>Filename:</strong> {contract.filename}
              </p>

              {/* Display PDF if it exists */}
              {contract.pdfData && (
                <div className="contract-pdf">
                  <h4>Contract :</h4>
                  <iframe
                    src={`data:application/pdf;base64,${base64Data}`}
                    title="Contract PDF"
                    width="500"
                    height="400"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreateContract;
