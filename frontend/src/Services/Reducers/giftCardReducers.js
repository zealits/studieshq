import {
  ALL_GIFT_CARDS_REQUEST,
  ALL_GIFT_CARDS_SUCCESS,
  ALL_GIFT_CARDS_FAIL,
  GIFT_CARD_DETAILS_REQUEST,
  GIFT_CARD_DETAILS_SUCCESS,
  GIFT_CARD_DETAILS_FAIL,
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
} from "../Constants/giftCardConstants";

export const giftCardsReducer = (state = { giftCards: [] }, action) => {
  switch (action.type) {
    case ALL_GIFT_CARDS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_GIFT_CARDS_SUCCESS:
      return {
        loading: false,
        giftCards: action.payload,
      };
    case ALL_GIFT_CARDS_FAIL:
      return {
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

export const giftCardDetailsReducer = (state = { giftCard: {} }, action) => {
  switch (action.type) {
    case GIFT_CARD_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case GIFT_CARD_DETAILS_SUCCESS:
      return {
        loading: false,
        giftCard: action.payload,
      };
    case GIFT_CARD_DETAILS_FAIL:
      return {
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

export const newGiftCardReducer = (state = {}, action) => {
  switch (action.type) {
    case GIFT_CARD_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GIFT_CARD_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        giftCard: action.payload,
      };
    case GIFT_CARD_CREATE_FAIL:
      return {
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
