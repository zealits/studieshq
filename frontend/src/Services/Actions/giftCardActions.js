import axios from 'axios';
import {
  ALL_GIFT_CARDS_FAIL,
  ALL_GIFT_CARDS_REQUEST,
  ALL_GIFT_CARDS_SUCCESS,
  GIFT_CARD_DETAILS_REQUEST,
  GIFT_CARD_DETAILS_FAIL,
  GIFT_CARD_DETAILS_SUCCESS,
  GIFT_CARD_UPDATE_REQUEST,
  GIFT_CARD_UPDATE_SUCCESS,
  GIFT_CARD_UPDATE_FAIL,
  GIFT_CARD_DELETE_REQUEST,
  GIFT_CARD_DELETE_SUCCESS,
  GIFT_CARD_DELETE_FAIL,
  GIFT_CARD_CREATE_REQUEST,
  GIFT_CARD_CREATE_SUCCESS,
  GIFT_CARD_CREATE_FAIL,
  CLEAR_ERRORS,
} from '../Constants/giftCardConstants';

// Get all gift cards
export const getGiftCards = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_GIFT_CARDS_REQUEST });

    const { data } = await axios.get('/aak/gift-cards');

    dispatch({
      type: ALL_GIFT_CARDS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_GIFT_CARDS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get gift card details
export const getGiftCardDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: GIFT_CARD_DETAILS_REQUEST });

    const { data } = await axios.get(`/aak/gift-card/${id}`);

    dispatch({
      type: GIFT_CARD_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GIFT_CARD_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create gift card
export const createGiftCard = (giftCardData) => async (dispatch) => {
  try {
    dispatch({ type: GIFT_CARD_CREATE_REQUEST });

    const { data } = await axios.post('/aak/gift-card/new', giftCardData);

    dispatch({
      type: GIFT_CARD_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GIFT_CARD_CREATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update gift card
export const updateGiftCard = (id, giftCardData) => async (dispatch) => {
  try {
    dispatch({ type: GIFT_CARD_UPDATE_REQUEST });

    const { data } = await axios.put(`/aak/gift-card/${id}`, giftCardData);

    dispatch({
      type: GIFT_CARD_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GIFT_CARD_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete gift card
export const deleteGiftCard = (id) => async (dispatch) => {
  try {
    dispatch({ type: GIFT_CARD_DELETE_REQUEST });

    await axios.delete(`/aak/gift-card/${id}`);

    dispatch({ type: GIFT_CARD_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: GIFT_CARD_DELETE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};


// emailjs.send("service_8eemr38", "template_aswjtaa", templateParams, "YpoxBk7FCyOu5qiel").then(