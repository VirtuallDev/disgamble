import { createSlice } from '@reduxjs/toolkit';

export const serverSlice = createSlice({
  name: 'serverObject',
  initialState: {
    serverObject: {
      author: {
        userId: '',
        username: '',
        image: '',
      },
      server: {
        name: '',
        image: '',
        description: '',
        dateCreated: Date.now(),
        usersOnline: [],
        id: 0,
      },
    },
  },
  reducers: {
    setServerObject: (state, action) => {
      state.serverObject = action.payload;
    },
  },
});

export const { setServerObject } = serverSlice.actions;

export default serverSlice.reducer;
