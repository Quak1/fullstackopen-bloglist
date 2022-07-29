import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

export const notificationSlice = createSlice({
  name: "users",
  initialState: null,
  reducers: {
    setUsers: (_, action) => {
      return action.payload;
    },
  },
});

export const fetchUsers = () => async (dispatch) => {
  const users = await usersService.getAll();
  dispatch(setUsers(users));
};

export const { setUsers } = notificationSlice.actions;

export default notificationSlice.reducer;
