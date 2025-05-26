import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
  },
  reducers: {
    setNotification: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setNotification, addNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice;
