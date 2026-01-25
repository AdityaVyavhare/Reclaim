import { createSlice } from "@reduxjs/toolkit";

export const itemsSlice = createSlice({
  name: "items",
  initialState: {
    registeredItems: [],
    reportedLostItems: [],
    reportedFoundItems: [],
    lostItems: [],
    foundItems: [],
  },
  reducers: {
    setAllItems: (state, action) => {
      state.registeredItems = action.payload.registeredItems || [];
      state.reportedLostItems = action.payload.reportedLostItems || [];
      state.reportedFoundItems = action.payload.reportedFoundItems || [];
      state.lostItems = action.payload.lostItems || [];
      state.foundItems = action.payload.foundItems || [];
    },
    setItems: (state, action) => {
      state[action.payload.collection_name] = action.payload.data || [];
    },
    addItem: (state, action) => {
      if (state[action.payload.collection_name]) {
        state[action.payload.collection_name].unshift(action.payload.data);
      }
    },
    updateItem: (state, action) => {
      if (state[action.payload.collection_name]) {
        state[action.payload.collection_name] = state[
          action.payload.collection_name
        ].map((item) =>
          item.iid === action.payload.iid
            ? { ...item, ...action.payload.data }
            : item
        );
      }
    },
    deleteItem: (state, action) => {
      if (state[action.payload.collection_name]) {
        state[action.payload.collection_name] = state[
          action.payload.collection_name
        ].filter((item) => item.iid !== action.payload.iid);
      }
    },
    getItems: (state, action) => {
      return state[action.payload.collection_name];
    },
  },
});

export const {
  getItems,
  setAllItems,
  setItems,
  addItem,
  updateItem,
  deleteItem,
} = itemsSlice.actions;
export default itemsSlice;
