import { configureStore } from '@reduxjs/toolkit';
import EditorReducer from '../features/Editor/EditorSlice';

export const store = configureStore({
  reducer: {
    EditorReducer: EditorReducer
  },
});
