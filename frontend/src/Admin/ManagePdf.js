import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ManagePdf.css"

const ManagePdf = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get('/aak/l1/getpdf');
        setPdfs(response.data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
        setMessage('Error fetching files');
      }
    };

    fetchPdfs();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/aak/l1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);

      // Refresh the list of PDFs after a successful upload
      const fetchPdfs = async () => {
        try {
          const response = await axios.get('/aak/l1/getpdf');
          setPdfs(response.data);
        } catch (error) {
          console.error('Error fetching PDFs:', error);
          setMessage('Error fetching files');
        }
      };
      fetchPdfs();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Error uploading file');
    }
  };

  const downloadPdf = async (id, filename) => {
    console.log(id);
    try {
      const response = await axios.get(`/aak/l1/pdf/${id}`, {
        responseType: 'blob', // Important for handling file downloads
      });

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Use the filename from the response
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Optional: Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setMessage('Error downloading file');
    }
  };

  return (
    <div className="manage-pdf-container">
      <h1 className="manage-pdf-title">Upload PDF</h1>
      <form className="manage-pdf-form" onSubmit={handleSubmit}>
        <input 
          type="file" 
          className="manage-pdf-file-input"
          onChange={handleFileChange} 
        />
        <button type="submit" className="manage-pdf-upload-button">Upload</button>
      </form>
      {message && <p className="manage-pdf-message">{message}</p>}
      
      <h2 className="manage-pdf-list-title">Uploaded Files</h2>
      <ul className="manage-pdf-list">
        {pdfs.map((pdf) => (
          <li 
            key={pdf._id} 
            className="manage-pdf-item" 
            onClick={() => downloadPdf(pdf._id, pdf.filename)}
          >
            {pdf.filename}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePdf;
