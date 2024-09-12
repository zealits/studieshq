import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePdf.css";
import contractpng from "../Assets/photos/contract.png";
import addpdf from "../Assets/photos/plus.png";
import uploadpdf from "../Assets/photos/uploadc.png";

const ManagePdf = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [preview, setPreview] = useState(addpdf); // To handle the preview of the upload icon

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/aak/l1/getpdf");
        setPdfs(response.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setMessage("Error fetching files");
      }
    };

    fetchPdfs();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(uploadpdf); // Change the icon to addpdf after selecting a file
    } else {
      setPreview(addpdf); // Reset to uploadpdf if no file is selected
    }
  };

  const handleImageClick = async () => {
    if (!file) {
      // Trigger the file input click if no file is selected
      document.getElementById("file-input").click();
    } else {
      // Submit the form if a file is selected
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/aak/l1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);

      // Refresh the list of PDFs after a successful upload
      const fetchPdfs = async () => {
        try {
          const response = await axios.get("/aak/l1/getpdf");
          setPdfs(response.data);
        } catch (error) {
          console.error("Error fetching PDFs:", error);
          setMessage("Error fetching files");
        }
      };
      fetchPdfs();
      setFile(null); // Reset file state after upload
      setPreview(uploadpdf); // Reset preview icon
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error uploading file");
    }
  };

  const downloadPdf = async (id, filename) => {
    try {
      const response = await axios.get(`/aak/l1/pdf/${id}`, {
        responseType: "blob", // Important for handling file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      setMessage("Error downloading file");
    }
  };

  return (
    <div className="manage-pdf-container">
      <h1 className="manage-pdf-title">Manage Contract</h1>

      {message && <p className="manage-pdf-message">{message}</p>}

      <h2 className="manage-pdf-list-title">All Contracts</h2>
      <ul className="manage-pdf-list">
        <form className="manage-pdf-form" onSubmit={handleSubmit}>
          {/* Image that triggers file input or form submission */}
          <img src={preview} alt="Upload PDF" className="manage-pdf-upload-icon" onClick={handleImageClick} />

          {/* Hidden file input */}
          <input
            type="file"
            id="file-input"
            className="manage-pdf-file-input"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Display the selected file name */}
          {file && <div className="file-name">{file.name}</div>}
          {!file && <div className="file-name">Upload Contract</div>}
        </form>

        {pdfs.map((pdf) => (
          <li key={pdf._id} className="manage-pdf-item" onClick={() => downloadPdf(pdf._id, pdf.filename)}>
            <div>
              <img src={contractpng} alt="Contract Icon" className="contract-icon" />
            </div>
            <div>{pdf.filename}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePdf;
