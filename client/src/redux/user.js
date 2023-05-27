import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userObject: {
      userInfo: {
        username: '',
        userId: '',
        image: '',
        status: '',
        about: '',
        dateOfBirth: Date.now(),
        creationDate: Date.now(),
      },
      userAuth: {
        email: '',
      },
      voiceSettings: {
        type: '',
        volume: '',
        key: '',
      },
      friends: {
        requests: [],
        friends: [],
        blocked: [],
      },
      serverList: [],
    },
  },
  reducers: {
    setUserObject: (state, action) => {
      state.userObject = action.payload;
    },
    friendChange: (state, action) => {
      const friendIndex = state.userObject.friends.friends.findIndex((friend) => friend === action.payload.userInfo.userId);
      if (friendIndex !== -1) state.userObject.friends.friends[friendIndex] = action.payload;
    },
  },
});

export const { setUserObject, friendChange } = userSlice.actions;

export default userSlice.reducer;
