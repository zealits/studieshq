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
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkCAYAAAAZtYVBAAAAAklEQVR4AewaftIAAAYJSURBVO3BQW4su5bAQFKo/W+Z7aFGAhJZ9td9fSLsB2NcYjHGRRZjXGQxxkUWY1xkMcZFFmNcZDHGRRZjXGQxxkUWY1xkMcZFFmNcZDHGRRZjXGQxxkU+vKTylyp2KruKb1L5TRU7lScqTlT+UsUbizEushjjIosxLvLhyyq+SeWk4gmVk4pdxRMqu4qdyk7lpOJEZVdxUvFNKt+0GOMiizEushjjIh9+mcoTFW+oPFGxU9lVnKicqOwqdiq7ip3Kb1J5ouI3Lca4yGKMiyzGuMiHf5zKScVO5aRip3JSsVPZVfymiv+SxRgXWYxxkcUYF/nwH1PxhMoTFd9UcVKxU/kvW4xxkcUYF1mMcZEPv6ziL6k8UbFT2VWcqJyo7CreqNip7CqeqLjJYoyLLMa4yGKMi3z4MpX/pYqdyq5ip7Kr2KnsKk4qdionKruKncqu4g2Vmy3GuMhijIssxriI/eAfpnJSsVM5qdip/KaKncoTFf8lizEushjjIosxLvLhJZVdxRMqu4qdym+qOKk4UTmp2Kk8UbFTOVH5pooTlV3FG4sxLrIY4yKLMS7y4aWKNyp2KruKE5UTlV3FTuWkYqdyUrFT2VX8poo3VHYqf2kxxkUWY1xkMcZFPnyZyknFScVO5aTijYo3KnYqT6jsKp5Q2VWcqDxR8ZcWY1xkMcZFFmNcxH7wgspJxU5lV7FT2VXsVL6p4kRlV7FTOak4UXmiYqfyRsUTKruKb1qMcZHFGBdZjHER+8EXqZxUPKHyRsVO5Y2KN1R2FTuV31RxorKr2KmcVLyxGOMiizEushjjIh9eUjmp2KnsKnYqu4oTlV3FTmVXsVM5qThR2VXsVHYVO5WTip3KScWJyhMqu4rftBjjIosxLrIY4yIf/ljFTmVXsVPZVZyonKjsKr5J5Y2Kb1LZVexUTip2KruKb1qMcZHFGBdZjHER+8EfUtlV7FR2FTuVJyp2KicVb6icVOxUTireUHmi4kTlpOKNxRgXWYxxkcUYF7EfXExlV/GEyknFTuWJip3KrmKnclKxU9lV7FSeqNipPFHxmxZjXGQxxkUWY1zEfvCCyknFicpJxRMqu4oTlV3FTuWJijdUnqjYqewqdiq7ihOVk4pvWoxxkcUYF1mMcZEPf0xlV3Gisqs4qdipvFGxU9lVfFPFicoTKicqJxV/aTHGRRZjXGQxxkU+vFSxUzmp2KnsKnYV31SxUzlR+SaVXcWJyonKScWJyq7iRGVX8U2LMS6yGOMiizEu8uGXqbyh8psqTipOVE4qTlR2FbuKE5VdxU7lmyp+02KMiyzGuMhijIvYD15QOanYqewqnlA5qdipnFTsVE4qTlSeqHhC5Y2KncquYqdyUvFNizEushjjIosxLvLhpYoTlV3FicpJxYnKruKJihOVXcVJxRsqu4oTlX/ZYoyLLMa4yGKMi9gP/pDKScU3qewqdionFTuVb6rYqewqdiq/qeJ/aTHGRRZjXGQxxkU+vKTyRsVO5YmKnco3qewqTlS+SeUvqbxR8cZijIssxrjIYoyL2A/+YSonFU+ovFHxhsquYqdyUvGEyq5ip7Kr+E2LMS6yGOMiizEu8uEllb9UcVKxU9lV7FTeqNip7CpOVE5UdhU7lROVXcUTFX9pMcZFFmNcZDHGRT58WcU3qZxUnFTsVN6o2Kk8obKr+E0V/5LFGBdZjHGRxRgX+fDLVJ6oeEJlV7FT2VV8U8WJyhMqJxUnKm+o7CpOVHYVbyzGuMhijIssxrjIh39cxU5lV7FT2VXsVHYVJyrfVHGisqvYqbxRsVM5qfimxRgXWYxxkcUYF/nw/5zKicqu4qRip7KrOFHZVewqdiq7ip3KrmKnslM5qfhNizEushjjIosxLvLhl1X8L6k8UbFTOanYqTyh8k0qu4p/yWKMiyzGuMhijIt8+DKVv6Syq9ipnFQ8ofJExRsqu4o3VHYVb6jsKt5YjHGRxRgXWYxxEfvBGJdYjHGRxRgXWYxxkcUYF1mMcZHFGBdZjHGRxRgXWYxxkcUYF1mMcZHFGBdZjHGRxRgXWYxxkf8DdLjoVJ38aLgAAAAASUVORK5CYII="></img>
        <button type="submit" disabled={loading ? true : false}>
          {loading ? "Loading..." : "Add Study"}
        </button>
      </form>
    </div>
  );
};

export default AddGig;
