import { createSlice } from '@reduxjs/toolkit';

export const messagesSlice = createSlice({
  name: 'messagesArray',
  initialState: {
    messagesArray: [],
  },
  reducers: {
    initialMessages: (state, action) => {
      state.messagesArray = action.payload;
    },
    messageAdded: (state, action) => {
      state.messagesArray = [...state.messagesArray, action.payload];
    },
    messageUpdated: (state, action) => {
      const index = state.messagesArray.findIndex((state) => state.message.id === action.payload.message.id);
      if (index !== -1) state.messagesArray[index] = action.payload;
    },
    messageDeleted: (state, action) => {
      const index = state.messagesArray.findIndex((state) => state.message.id === action.payload.message.id);
      if (index !== -1) state.messagesArray.splice(index, 1);
    },
  },
});

export const { messageAdded, messageUpdated, messageDeleted, initialMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
