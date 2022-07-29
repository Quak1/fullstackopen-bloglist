import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notification: null,
    error: null,
  },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setMessage: (state, action) => {
      state[action.payload.key] = action.payload.message;
    },
    clearMessage: (state, action) => {
      state[action.payload] = null;
    },
    clearAll: () => {
      return {
        notification: null,
        error: null,
      };
    },
  },
});

export const {
  setNotification,
  clearNotification,
  setError,
  clearError,
  setMessage,
  clearMessage,
  clearAll,
} = notificationSlice.actions;

export default notificationSlice.reducer;
