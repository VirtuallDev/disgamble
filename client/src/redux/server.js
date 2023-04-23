import { createSlice } from '@reduxjs/toolkit';

export const serverSlice = createSlice({
  name: 'serverObject',
  initialState: {
    serverObject: {
      servername: '',
      serverId: '',
      serverImage: '',
      serverAddress: '',
      usersOnline: [],
      description: '',
      dateCreated: '',
      channels: [],
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
