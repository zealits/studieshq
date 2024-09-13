import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGig, clearErrors } from "../Services/Actions/gigsActions.js";
import axios from "axios";
import "./AddGig.css";

const AddGig = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(""); // State for selected PDF
  const [pdfs, setPdfs] = useState([]); // State for list of PDFs
  const [message, setMessage] = useState(""); // State for messages

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.gig);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert("Study added successfully");
      // Clear form fields
      setTitle("");
      setDescription("");
      setDeadline("");
      setBudget("");
      setSelectedPdf(""); // Clear selected PDF
    }
  }, [dispatch, error, success]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        // const response = await axios.get("/aak/l1/getpdf");
        const response = await axios.get("/aak/l1/contracts");

        setPdfs(response.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setMessage("Error fetching files");
      }
    };

    fetchPdfs();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    const gigData = {
      title,
      description,
      deadline,
      budget,
      pdf: selectedPdf, // Add selected PDF to gig data
    };

    // console.log(selectedPdf);

    dispatch(addGig(gigData));
  };

  return (
    <div className="add-gig">
      <form onSubmit={submitHandler}>
        <h1>Add Study</h1>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Deadline</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>
        <div>
          <label>Budget</label>
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} required />
        </div>
        <div>
          <label>Select PDF</label>
          <select value={selectedPdf} onChange={(e) => setSelectedPdf(e.target.value)} required>
            <option value="">Select a PDF</option>
            {pdfs.map((pdf) => (
              <option key={pdf._id} value={pdf._id}>
                {pdf.filename}
              </option>
            ))}
          </select>
        </div>
        {message && <p className="error-message">{message}</p>}
        <button type="submit" disabled={loading ? true : false}>
          {loading ? "Loading..." : "Add Study"}
        </button>
      </form>
    </div>
  );
};

export default AddGig;
