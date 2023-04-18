import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userObject',
  initialState: {
    userObject: {
      username: '',
      userId: '',
      userImage: '',
      status: '',
      bio: '',
      friends: [],
      friendRequests: [],
      blockedUsers: [],
      serverList: [],
    },
  },
  reducers: {
    setUserObject: (state, action) => {
      state.userObject = action.payload;
    },
  },
});

export const { setUserObject } = userSlice.actions;

export default userSlice.reducer;
