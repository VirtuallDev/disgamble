import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import soundsReducer from './sounds';
import serverReducer from './server';
import messagesReducer from './messages';
import accesstokenReducer from './accesstoken';

export const store = configureStore({
  reducer: {
    user: userReducer,
    sounds: soundsReducer,
    server: serverReducer,
    messages: messagesReducer,
    accesstoken: accesstokenReducer,
  },
});
