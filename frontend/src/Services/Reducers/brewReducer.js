import {
    UPLOAD_CSV_REQUEST,
    UPLOAD_CSV_SUCCESS,
    UPLOAD_CSV_FAIL,
  } from '../Constants/brewConstants';
  
  export const brewReducer = (state = {}, action) => {
    switch (action.type) {
      case UPLOAD_CSV_REQUEST:
        return { loading: true };
      case UPLOAD_CSV_SUCCESS:
        return { loading: false, success: true, data: action.payload };
      case UPLOAD_CSV_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  

  