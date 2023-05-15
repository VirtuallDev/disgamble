import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userObject',
  initialState: {
    userObject: {
      username: '',
      userId: '',
      userImage: '',
      status: '',
      about: '',
      friends: [],
      friendRequests: [],
      blockedUsers: [],
      serverList: [],
      ads: [],
    },
  },
  reducers: {
    setUserObject: (state, action) => {
      state.userObject = action.payload;
    },
    friendChange: (state, action) => {
      const index = state.userObject.friends.findIndex((friend) => action.payload.userObject.userId === friend);
      if (!index === -1) state.userObject.friends[index] = action.payload.userObject;
    },
  },
});

export const { setUserObject, friendChange } = userSlice.actions;

export default userSlice.reducer;
