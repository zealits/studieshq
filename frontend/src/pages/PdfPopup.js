import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import "./PdfPopup.css"; // Assuming you save the CSS in PdfPopup.css
import axios from "axios";

const PdfPopup = ({ blobData, cid2, gigId2, onClose }) => {
  const sigCanvas = useRef({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showSignature, setShowSignature] = useState(false); // State to control the visibility of the signature canvas
  const [showAlert, setShowAlert] = useState(false); // State for the popup alert
  let vaish = btoa(blobData);

  const userEmail = useSelector((state) => state.user.user.email);
  const userId = useSelector((state) => state.user.user._id);

  const [formData, setFormData] = useState({
    signature: "",
  });

  useEffect(() => {
    if (blobData) {
      // Create a Blob from the binary PDF data
      const blob = new Blob([blobData], { type: "application/pdf" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Set the URL in the state to be used in the iframe
      setPdfUrl(url);

      // Cleanup the URL when the component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [blobData]);

  const handleClearSignature = () => {
    sigCanvas.current.clear();
    setFormData({ ...formData, signature: "" });
  };

  const handleSaveSignature = () => {
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setFormData({ ...formData, signature });
    // console.log("Saved Signature:", signature);
    // Handle signature as needed (e.g., save to state, send to backend)
  };

  const handleSubmitContract = async (e) => {
    e.preventDefault();

    if (!formData.signature) {
      // Show the alert popup if the signature is missing
      setShowAlert(true);
      return;
    }

    try {
      let contractId = cid2;
      let email = userEmail;
      let gigId = gigId2;
      // Send a PUT request to update the contract by ID
      const response = await axios.put(`/aak/l1/contracts/${cid2}`, {
        userId,
        contractId,
        email,
        gigId,
        signature: formData.signature,
      });

      console.log(response);
      // Display success message
      // setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      // Handle errors (e.g., show an error message)
      // setMessage(error.response ? error.response.data.message : "An error occurred while updating the contract.");
    }
  };

  const handleSignClick = () => {
    setShowSignature(true); // Show the signature canvas when the "Sign" button is clicked
  };

  const handleCloseAlert = () => {
    setShowAlert(false); // Close the alert popup
  };

  return (
    <div className="pdf-popup-overlay">
      <div className="pdf-popup-content">
        {/* PDF Viewer Section */}
        <div className="pdf-popup-pdf-viewer">
          {pdfUrl ? (
            <iframe
              title="PDF Preview"
              className="pdf-popup-iframe"
              src={`data:application/pdf;base64,${vaish}`}
              width="100%"
              height="400px"
            />
          ) : (
            <p>Loading PDF...</p>
          )}

          {/* {!showSignature && (
            <button onClick={handleSignClick} className="pdf-popup-sign-button">
              Sign
            </button>
          )} */}
        </div>

        {/* Signature Section */}
        <div className={`pdf-popup-signature ${true ? "show" : ""}`}>
          <form>
            <label className="pdf-popup-signature-label">Signature:</label>
            <SignatureCanvas
              penColor="blue"
              canvasProps={{ className: "pdf-popup-signature-canvas" }}
              ref={sigCanvas}
            />
            <div className="pdf-popup-signature-buttons">
              <button type="button" className="pdf-popup-save-button" onClick={handleSaveSignature}>
                Save Signature
              </button>
              <button type="button" className="pdf-popup-clear-button" onClick={handleClearSignature}>
                Clear Signature
              </button>
            </div>
            <button type="submit" className="pdf-popup-clear-button" onClick={handleSubmitContract}>
              Submit
            </button>
          </form>
        </div>

        <button onClick={onClose} className="pdf-popup-close-button">
          Close
        </button>
      </div>

      {/* Alert Popup */}
      {showAlert && (
        <div className="pdf-popup-alert">
          <div className="pdf-popup-alert-content">
            <p>Please sign the contract before submitting.</p>
            <button onClick={handleCloseAlert} className="pdf-popup-alert-close-button">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfPopup;
