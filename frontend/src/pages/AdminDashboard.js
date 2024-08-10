import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./AdminDashboard.css";
import Modal from "react-modal";
import Loading from "../components/Loading";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const token = useSelector((state) => state.user.token);

  const fetchGigs = async () => {
    try {
      const response = await axios.get("/aak/l1/admin/gigs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGigs(response.data.gigs || []);
      setLoading(false);
    } catch (error) {
      setError("Error fetching gigs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [token]);

  const generateOverallPieData = (gigsList) => {
    const statusCounts = {
      applied: 0,
      allocated: 0,
      completed: 0,
    
    };

    gigsList.forEach((gig) => {
      gig.applicantsDetails.forEach((applicant) => {
        applicant.gigs.forEach((gigDetail) => {
          if (statusCounts[gigDetail.status.toLowerCase()] !== undefined) {
            statusCounts[gigDetail.status.toLowerCase()]++;
          }
        });
      });
    });

    return Object.keys(statusCounts).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
    }));
  };

  const handlePieClick = (data) => {
    setSelectedStatus(data.name.toLowerCase());
  };

  const approveGig = async (userId, gigId) => {
    try {
      await axios.put(
        `/aak/l1/admin/gig/approve/${userId}/${gigId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPopupMessage("Study approved successfully!");
    } catch (error) {
      console.error("Error approving study", error);
    }
  };

  const getStatus = (applicantGigs, gigId) => {
    const gigDetail = applicantGigs.find((gigDetail) => gigDetail.gigId === gigId);
    return gigDetail ? gigDetail.status : "Not Applied";
  };

  const closeModal = () => {
    setPopupMessage("");
    fetchGigs();
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="pie-chart-container">
        <h2>Overall Studies Status</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={generateOverallPieData(gigs)}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}

            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onClick={handlePieClick}
          >
            {generateOverallPieData(gigs).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      {selectedStatus && (
        <>
          <div className="status-section">
            <h2>{`${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Users`}</h2>
            <div className="gig-list">
              {gigs.map((gig) => {
                const filteredApplicants = gig.applicantsDetails.filter((applicant) =>
                  applicant.gigs.some((gigDetail) => gigDetail.status.toLowerCase() === selectedStatus)
                );
                return (
                  <div key={gig._id} className="astudy-card">
                    <h2>{gig.title}</h2>
                    <div className="applicant-list">
                      {filteredApplicants.length > 0 ? (
                        filteredApplicants.map((applicant) => (
                          <div key={applicant._id} className="applicant-card">
                            <h3>{applicant.name}</h3>
                            <p>Email: {applicant.email}</p>
                            <p>Status: {getStatus(applicant.gigs, gig._id)}</p>
                            {getStatus(applicant.gigs, gig._id) === "applied" && (
                              <button onClick={() => approveGig(applicant._id, gig._id)}>Approve</button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No applicants with status {selectedStatus}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      {popupMessage && (
        <Modal isOpen={!!popupMessage} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
          <h2>{popupMessage}</h2>
          <button className="btn btn-info" onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
