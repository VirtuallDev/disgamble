import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import soundsReducer from './sounds';
import serverReducer from './server';

export const store = configureStore({
  reducer: {
    user: userReducer,
    sounds: soundsReducer,
    server: serverReducer,
  },
});
