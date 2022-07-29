import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser: (_, action) => {
      return action.payload;
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser } = notificationSlice.actions;

export default notificationSlice.reducer;
