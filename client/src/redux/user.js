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
      ads: [],
    },
  },
  reducers: {
    setUserObject: (state, action) => {
      state.userObject = action.payload;
    },
    friendStatusChange: (state, action) => {
      const index = state.userObject.friends.findIndex((friend) => action.payload.userId === friend);
      if (!index === -1) state.userObject.friends[index].status = action.payload.status;
    },
  },
});

export const { setUserObject } = userSlice.actions;

export default userSlice.reducer;
