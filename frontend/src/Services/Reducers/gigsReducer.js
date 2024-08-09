import {
  FETCH_GIGS_REQUEST,
  FETCH_GIGS_SUCCESS,
  FETCH_GIGS_FAIL,
  APPLY_GIG_REQUEST,
  APPLY_GIG_SUCCESS,
  APPLY_GIG_FAIL,
  ADD_GIG_REQUEST,
  ADD_GIG_SUCCESS,
  ADD_GIG_FAIL,
  CLEAR_ERRORS,
} from "../Constants/gigsConstants";

export const gigsReducer = (state = { gigs: [] }, action) => {
  switch (action.type) {
    case ADD_GIG_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_GIG_SUCCESS:
      return {
        loading: false,
        success: true,
        gig: action.payload,
      };
    case ADD_GIG_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_GIGS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_GIGS_SUCCESS:
      return {
        loading: false,
        gigs: action.payload,
      };
    case FETCH_GIGS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case APPLY_GIG_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case APPLY_GIG_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    case APPLY_GIG_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
