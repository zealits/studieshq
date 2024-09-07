import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGig, clearErrors } from "../Services/Actions/gigsActions.js";
import "./AddGig.css";

const AddGig = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.gig);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert("study added successfully");
      // Clear form fields
      setTitle("");
      setDescription("");
      setDeadline("");
      setBudget("");
    }
  }, [dispatch, error, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    const gigData = {
      title,
      description,
      deadline,
      budget,
    };

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
        <button type="submit" disabled={loading ? true : false}>
          {loading ? "Loading..." : "Add Study"}
        </button>
      </form>
    </div>
  );
};

export default AddGig;
