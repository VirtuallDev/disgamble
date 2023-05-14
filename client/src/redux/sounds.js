import { createSlice } from '@reduxjs/toolkit';

export const soundsSlice = createSlice({
  name: 'soundObject',
  initialState: {
    soundObject: {
      isMuted: false,
      isDeafened: false,
      pushToTalk: false,
      isTalking: false,
    },
  },
  reducers: {
    toggleMute: (state) => {
      state.soundObject.isMuted = !state.soundObject.isMuted;
    },
    toggleDeafen: (state) => {
      state.soundObject.isDeafened = !state.soundObject.isDeafened;
    },
    triggerPushToTalk: (state, action) => {
      state.soundObject.pushToTalk = action.payload;
    },
    toggleIsTalking: (state, action) => {
      state.soundObject.isTalking = action.payload;
    },
  },
});

export const { toggleMute, toggleDeafen, triggerPushToTalk, toggleIsTalking } = soundsSlice.actions;

export default soundsSlice.reducer;
