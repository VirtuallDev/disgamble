import { createSlice } from '@reduxjs/toolkit';

export const callsSlice = createSlice({
  name: 'callsArray',
  initialState: {
    callsArray: [],
  },
  reducers: {
    addCall: (state, action) => {
      const newCallsArray = [...state.callsArray, action.payload];
      return { ...state, callsArray: newCallsArray };
    },
    updateCall: (state, action) => {
      console.log(action.payload);
      const newCallsArray = [...state.callsArray];
      const index = newCallsArray.findIndex((call) => call.callId === action.payload.callId);
      if (index === -1) return state;
      newCallsArray.splice(index, 1, action.payload);
      return { ...state, callsArray: newCallsArray };
    },
    deleteCall: (state, action) => {
      const newCallsArray = state.callsArray.filter((call) => call.callId !== action.payload);
      return { ...state, callsArray: newCallsArray };
    },
  },
});

export const { addCall, updateCall, deleteCall } = callsSlice.actions;

export default callsSlice.reducer;
