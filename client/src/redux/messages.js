import { createSlice } from '@reduxjs/toolkit';

export const messagesSlice = createSlice({
  name: 'messageArray',
  initialState: {
    messageArray: [
      {
        authorId: '123',
        authorName: '123',
        authorImage: '1223',
        recipients: [123, 123],
        message: '123',
        messageId: '123',
        sentAt: '123',
      },
      {
        authorId: '123',
        authorName: '123',
        authorImage: '1223',
        recipients: [123, 123],
        message: '123',
        messageId: '123',
        sentAt: '123',
      },
    ],
  },
  reducers: {
    newMessage: (state, action) => {
      state.messageArray = action.payload;
    },
  },
});

export const { setServerObject } = messagesSlice.actions;

export default messagesSlice.reducer;
