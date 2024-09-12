import React, { useRef, useState } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import "./CreateContract.css"

const CreateContract = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    userId: '',          // Example: Replace with the actual user ID from your app's state or context
    jobTitle: '',
    projectDetails: '',
    freelanceStudyDetails: '',
    signature: '',
  });

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
    setFormData({ ...formData, signature: '' });
  };

  const handleSaveSignature = () => {
    // Save the signature as a base64 string
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setFormData({ ...formData, signature });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to backend
      const response = await axios.post('/aak/l1/contracts', formData);
      console.log('Contract created successfully:', response.data);
      alert('Contract created successfully!');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    }
  };

  return (
    <div className="create-contract-container">
      <h2 className="create-contract-title">Create Contract</h2>
      <form className="create-contract-form" onSubmit={handleSubmit}>
        <div className="create-contract-field">
          <label htmlFor="userId" className="create-contract-label">User ID:</label>
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
          <label htmlFor="jobTitle" className="create-contract-label">Job Title:</label>
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
          <label htmlFor="projectDetails" className="create-contract-label">Project Details:</label>
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
          <label htmlFor="freelanceStudyDetails" className="create-contract-label">Freelance Study Details:</label>
          <textarea
            id="freelanceStudyDetails"
            name="freelanceStudyDetails"
            value={formData.freelanceStudyDetails}
            onChange={handleChange}
            className="create-contract-textarea"
          />
        </div>
        <div className="create-contract-signature">
          <label className="create-contract-label">Signature:</label>
          <SignatureCanvas 
            penColor="black"
            canvasProps={{ width: 300, height: 200, className: 'create-contract-signatureCanvas' }}
            ref={sigCanvas}
          />
          <div className="create-contract-signature-buttons">
            <button type="button" className="create-contract-save-button" onClick={handleSaveSignature}>Save Signature</button>
            <button type="button" className="create-contract-clear-button" onClick={handleClearSignature}>Clear Signature</button>
          </div>
        </div>
        <button type="submit" className="create-contract-submit-button">Create Contract</button>
      </form>
    </div>
  );
};

export default CreateContract;
