import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import soundsReducer from './sounds';

export const store = configureStore({
  reducer: {
    user: userReducer,
    sounds: soundsReducer,
  },
});
