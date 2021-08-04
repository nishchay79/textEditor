import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firestore } from './../../Utils/firebase';
import { calculateCharLength, calculateWordLength } from './../../Utils/handleLength'



const initialState = {
  Data: "",
  DraftData: "",
  text: "",
  textLength: 0,
  textCharLength: 0
};

export const StoreDataToFirebase = createAsyncThunk(
  'Editor/StoreDataToFirebase',
  async (data, translatedData) => {
    firestore.collection("TextEditor").add({
      data: data,
      translatedData: translatedData
    })
  }
);

export const EditorSlice = createSlice({
  name: 'Editor',
  initialState,
  reducers: {
    resetData: (state) => {
      state.text = "";
      state.textLength = 0;
      state.textCharLength = 0;
      window.localStorage.clear()
    },
    saveDataInLocalStorage: (state, action) => {
      window.localStorage.setItem('draft', action.payload)
    },
    getDataFromLocalStorage: (state) => {
      let DraftText = window.localStorage.getItem('draft');
      if (DraftText === null) {
        return;
      } else {
        state.textLength = calculateCharLength(DraftText);
        state.textCharLength = calculateWordLength(DraftText);
        state.text = DraftText
      }
    },
    setText: (state, action) => {
      state.text = action.payload;
    },
    setTextLength: (state, action) => {
      state.textLength = action.payload;
    },
    setTextCharLength: (state, action) => {
      state.textCharLength = action.payload;
    },
  },
  extraReducers: (builder) => {

  },
});

export const { saveDataInLocalStorage, setText, setTextLength, setTextCharLength, resetData, getDataFromLocalStorage } = EditorSlice.actions;

export default EditorSlice.reducer;
