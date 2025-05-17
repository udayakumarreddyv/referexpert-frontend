import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  token: null,
  userEmail: null,
  userType: null,
  userDetails: {},
  pendingTasks: {}
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.loggedIn = true;
      state.token = action.payload.token;
      state.userEmail = action.payload.userEmail;
      state.userType = action.payload.userType;
      state.userDetails = action.payload.userDetails;
      state.pendingTasks = action.payload.pendingTasks;
    },
    updateAccessToken: (state, action) => {
      state.token = action.payload.token;
    },
    updateUser: (state, action) => {
      state.userDetails = action.payload;
    },
    updatePendingTasks: (state, action) => {
      state.pendingTasks = action.payload;
    },
    logoutUser: (state) => {
      state.loggedIn = false;
      state.userEmail = null;
      state.userType = null;
      state.pendingTasks = {};
      state.token = null;
      state.userDetails = {};
    }
  }
});

export const { loginUser, updateAccessToken, updateUser, updatePendingTasks, logoutUser } = userSlice.actions;
export default userSlice.reducer;
