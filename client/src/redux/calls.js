import { createSlice } from '@reduxjs/toolkit';

export const callsSlice = createSlice({
  name: 'callsArray',
  initialState: {
    callsArray: [],
  },
  reducers: {
    addCall: (state, action) => {
      state.callsArray = [...state.callsArray, action.payload];
    },
    updateCall: (state, action) => {
      const newArray = state.callsArray;
      const index = newArray.findIndex((call) => call.callId === action.payload.callId);
      if (index === -1) return;
      newArray.splice(index, 1, action.payload);
      state.callsArray = newArray;
    },
    deleteCall: (state, action) => {
      const newArray = state.callsArray;
      state.callsArray = newArray.filter((call) => call.callId !== action.payload);
    },
  },
});

export const { addCall, updateCall, deleteCall } = callsSlice.actions;

export default callsSlice.reducer;
