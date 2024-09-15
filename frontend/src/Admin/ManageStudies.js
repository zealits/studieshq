import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Modal from "react-modal";
import "./ManageStudies.css";
import Loading from "../components/Loading";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ManageStudies = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", budget: "", deadline: "" });
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await axios.get("/aak/l1/admin/gigs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGigs(response.data.gigs || []);
        // console.log(gigs);
        setLoading(false);
      } catch (error) {
        setError("Error fetching gigs");
        setLoading(false);
      }
    };

    fetchGigs();
    console.log(gigs);
  }, [token]);

  const generatePieData = (applicants) => {
    const statusCounts = {
      applied: 0,
      allocated: 0,
      completed: 0,
    };

    if (!applicants) {
      return [];
    }

    applicants.forEach((applicant) => {
      if (applicant.gigs) {
        applicant.gigs.forEach((gigDetail) => {
          const status = gigDetail.status ? gigDetail.status.toLowerCase() : null;
          if (status && statusCounts[status] !== undefined) {
            statusCounts[status]++;
          }
        });
      }
    });

    return Object.keys(statusCounts).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
    }));
  };

  const handleEdit = (study) => {
    setSelectedStudy(study);
    setFormData({
      title: study.title,
      description: study.description,
      budget: study.budget,
      deadline: study.deadline,
    });
  };

  const handleShare = (gig) => {
    if (navigator.share) {
      navigator
        .share({
          title: gig.title,
          text: gig.description,
          url: window.location.href, // You can replace this with a specific URL related to the gig
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback code for non-supporting browsers
      alert("Web Share API is not supported in your browser. Please share manually.");
    }
  };

  const openDeleteModal = (study) => {
    setStudyToDelete(study);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setStudyToDelete(null);
  };

  const handleDelete = async () => {
    if (studyToDelete) {
      setLoadingAction(true);
      try {
        await axios.delete(`/aak/l1/admin/gig/${studyToDelete._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGigs(gigs.filter((gig) => gig._id !== studyToDelete._id));
      } catch (error) {
        setError("Error deleting study");
      } finally {
        setLoadingAction(false);
        closeDeleteModal();
      }
    }
  };

  const handleUpdate = async () => {
    setLoadingAction(true);
    try {
      const response = await axios.put(`/aak/l1/admin/gig/${selectedStudy._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGigs(gigs.map((gig) => (gig._id === selectedStudy._id ? response.data.gig : gig)));
      setSelectedStudy(null);
    } catch (error) {
      setError("Error updating study");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setSelectedStudy(null);
  };

  const downloadPdf = async (pdfUrl) => {
    let id = pdfUrl._id;
    console.log(id);
    try {
      const response = await axios.get(`/aak/l1/pdf/${id}`, {
        responseType: "blob", // Important for handling file downloads
      });

     

      // Extract the filename from the Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "downloaded_file"; // Default filename
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/['"]/g, ""); // Remove any quotes around the filename
      }

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Use the extracted filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Optional: Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      // setMessage('Error downloading file');
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="manage-studies">
      <h1>Manage Studies</h1>
      <Modal isOpen={!!selectedStudy} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <h2>Edit Study</h2>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="Gift Card" />
        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} placeholder="Deadline" />
        <button className="btn btn-info" onClick={handleUpdate} disabled={loadingAction}>
          {loadingAction ? "Saving..." : "Save"}
        </button>
        <button className="btn btn-info" onClick={closeModal}>
          Cancel
        </button>
      </Modal>

      <Modal isOpen={deleteModalIsOpen} onRequestClose={closeDeleteModal} className="modal" overlayClassName="overlay">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this study?</p>
        <button className="btn btn-danger" onClick={handleDelete} disabled={loadingAction}>
          {loadingAction ? "Deleting..." : "Delete"}
        </button>
        <button className="btn btn-secondary" onClick={closeDeleteModal}>
          Cancel
        </button>
      </Modal>
      <div className="studies-list">
        {gigs.length === 0 ? (
          <p>No studies available</p>
        ) : (
          gigs.map((study) => (
            <div key={study._id} className="study-card">
              <h2>{study.title}</h2>
              <p>Description: {study.description}</p>
              <p>Gift Card: ${study.budget}</p>
              <p>Deadline: {study.deadline}</p>
              {study.pdfDetails && (
                <p className="pdf-container">
                  <span>PDF:</span>
                  <span className="btn btn-link" onClick={() => downloadPdf(study.pdfDetails)}>
                    Download PDF
                  </span>
                </p>
              )}
              <div className="pie-chart-container">
                <PieChart width={400} height={400}>
                  <Pie
                    data={generatePieData(study.applicantsDetails)}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {generatePieData(study.applicantsDetails).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div className="study-actions">
                <button className="btn btn-info" onClick={() => handleEdit(study)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => openDeleteModal(study)} disabled={loadingAction}>
                  {loadingAction ? "Deleting..." : "Delete"}
                </button>
                <button className="btn " onClick={() => handleShare(study)}>
                  share
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageStudies;
