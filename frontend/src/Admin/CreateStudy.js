import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGig, clearErrors } from "../Services/Actions/gigsActions.js";
import axios from "axios";
import "./CreateStudy.css";

const CreateStudy = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState(""); // New state for location
  const [selectedPdf, setSelectedPdf] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
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
      setLocation(""); // Reset location
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
        const base64String = reader.result.split(",")[1];
        setImage(base64String);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      deadline,
      budget,
      location, // Include location in form data
      pdf: selectedPdf,
      image,
      languages,
    };

    console.log("FormData being sent:", formData);
    dispatch(addGig(formData));
  };

  return (
    <div className="create-study">
      <form onSubmit={submitHandler}>
        <h1 className="create-study__header">Create Study</h1>
        <div className="create-study__input-group">
          <label className="create-study__label">Title</label>
          <input
            type="text"
            className="create-study__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="create-study__input-group">
          <label className="create-study__label">Description</label>
          <textarea
            className="create-study__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="create-study__input-row">
          <div className="create-study__input-group">
            <label className="create-study__label">Deadline</label>
            <input
              type="date"
              className="create-study__input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="create-study__input-group">
            <label className="create-study__label">Gift Amount</label>
            <input
              type="number"
              className="create-study__input"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div className="create-study__input-group">
            <label className="create-study__label">Location</label>
            <input
              type="text"
              className="create-study__input"
              value={location}
              onChange={(e) => setLocation(e.target.value)} // Update location on change
              required
            />
          </div>
          <div className="create-study__input-group">
            <label className="create-study__label">Select Contract</label>
            <select
              className="create-study__select"
              value={selectedPdf}
              onChange={(e) => setSelectedPdf(e.target.value)}
              required
            >
              <option value="">Select a Contract</option>
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
        </div>
        <div className="create-study__input-group">
          <label className="create-study__label">Upload Image</label>
          <input
            type="file"
            className="create-study__file-input"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="create-study__image-preview" />}
        </div>
        <div className="create-study__input-group">
          <label className="create-study__label">Select Languages</label>
          <div className="create-study__checkbox-group">
            {[
              "English",
              "Spanish",
              "French",
              "German",
              "Italian",
              "Portuguese",
              "Chinese",
              "Japanese",
              "Korean",
              "Russian",
              "Arabic",
              "Hindi",
              "Turkish",
              "Dutch",
              "Swedish",
            ].map((lang) => (
              <div key={lang} className="create-study__checkbox-item">
                <input
                  type="checkbox"
                  value={lang}
                  checked={languages.includes(lang)}
                  onChange={handleLanguageChange}
                />
                <label>{lang}</label>
              </div>
            ))}
          </div>
        </div>
        {message && <p className="create-study__error-message">{message}</p>}
        <button type="submit" className="create-study__submit-button" disabled={loading}>
          {loading ? "Loading..." : "Add Study"}
        </button>
      </form>
    </div>
  );
};

export default CreateStudy;
