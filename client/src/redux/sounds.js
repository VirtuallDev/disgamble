import { createSlice } from '@reduxjs/toolkit';

export const soundsSlice = createSlice({
  name: 'soundObject',
  initialState: {
    soundObject: {
      isMuted: false,
      isDeafened: false,
    },
  },
  reducers: {
    toggleMute: (state) => {
      state.soundObject.isMuted = !state.soundObject.isMuted;
    },
    toggleDeafen: (state) => {
      state.soundObject.isDeafened = !state.soundObject.isDeafened;
    },
  },
});

export const { toggleMute, toggleDeafen } = soundsSlice.actions;

export default soundsSlice.reducer;
