import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import itemsSlice from "./itemsSlice";
import postSlice from "./postSlice";
import notificationSlice from "./notificationSlice";
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    items: itemsSlice.reducer,
    posts: postSlice.reducer,
    notification: notificationSlice.reducer,
  },
});
