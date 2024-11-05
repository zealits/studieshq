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
  const [selectedPdf, setSelectedPdf] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [image, setImage] = useState(""); // Store the Base64 image string here
  const [imagePreview, setImagePreview] = useState(""); // For image preview
  const [languages, setLanguages] = useState([]);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.gig);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert("Study added successfully");
      setTitle("");
      setDescription("");
      setDeadline("");
      setBudget("");
      setSelectedPdf("");
      setImage("");
      setImagePreview("");
      setLanguages([]);
    }
  }, [dispatch, error, success]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/aak/l1/contracts");
        setPdfs(response.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setMessage("Error fetching files");
      }
    };

    fetchPdfs();
  }, []);

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    if (languages.includes(value)) {
      setLanguages(languages.filter((lang) => lang !== value));
    } else {
      setLanguages([...languages, value]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Extract base64 part
        setImage(base64String); // Store the base64 string
        setImagePreview(reader.result); // Set the full data URL for preview
      };
      reader.readAsDataURL(file); // Read file as Data URL
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      deadline,
      budget,
      pdf: selectedPdf,
      image, // Base64 string of the image
      languages,
    };

    console.log("FormData being sent:", formData); // Log the data to be sent

    dispatch(addGig(formData));
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
            {Array.isArray(pdfs) && pdfs.length > 0 ? (
              pdfs.map((pdf) => (
                <option key={pdf._id} value={pdf._id}>
                  {pdf.filename}
                </option>
              ))
            ) : (
              <option disabled>No PDFs available</option>
            )}
          </select>
        </div>
        <div>
          <label>Upload Image</label>
          <input type="file" onChange={handleImageChange} accept="image/*" required />
          {imagePreview && <img src={imagePreview} alt="Image Preview" className="image-preview" />}
        </div>
        <div>
          <label>Select Languages</label>
          <select multiple value={languages} onChange={handleLanguageChange} required>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        {message && <p className="error-message">{message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add Study"}
        </button>
      </form>
    </div>
  );
};

export default AddGig;
