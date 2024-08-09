import axios from "axios";
import { UPLOAD_CSV_REQUEST, UPLOAD_CSV_SUCCESS, UPLOAD_CSV_FAIL } from "../Constants/brewConstants";

export const uploadCSV = (file) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_CSV_REQUEST });

    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post("/aak/importGift", formData, config);

    dispatch({ type: UPLOAD_CSV_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPLOAD_CSV_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};



