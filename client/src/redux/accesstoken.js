import { createSlice } from '@reduxjs/toolkit';

export const accessTokenSlice = createSlice({
  name: 'accessToken',
  initialState: {
    accessToken: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAccessToken } = accessTokenSlice.actions;

export default accessTokenSlice.reducer;
