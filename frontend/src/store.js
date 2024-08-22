import { configureStore } from "@reduxjs/toolkit";
import { brewReducer } from "./Services/Reducers/brewReducer";
import { giftCardsReducer, newGiftCardReducer } from "./Services/Reducers/giftCardReducers";
import {
  adminReducer,
  authReducer,
  forgotPasswordReducer,
  profileReducer,
  userReducer,
} from "./Services/Reducers/userReducer.js";
import { gigsReducer } from "./Services/Reducers/gigsReducer.js";

const store = configureStore({
  reducer: {
    brew: brewReducer,
    gift: giftCardsReducer,
    newGiftCard: newGiftCardReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    profile: profileReducer,
    gig: gigsReducer,
    admin: adminReducer,
    auth: authReducer,
  },
});

export default store;
