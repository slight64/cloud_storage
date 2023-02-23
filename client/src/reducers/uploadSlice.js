import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVisible: false,
  files: [],
};

const uploaderSlice = createSlice({
  name: 'uploader',
  initialState,
  reducers: {
    showUploder(state) {
      state.isVisible = true;
    },
    hideUploder(state) {
      state.isVisible = false;
    },
    addUploadFile(state, action) {
      state.files.push(action.payload);
    },
    removeUploadFIle(state, action) {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    changeUploadFile(state, action) {
      return state.files.map((file) =>
        file.id === action.payload.id
          ? (file.progress = action.payload.progress)
          : file
      );
    },
  },
});

export const {
  showUploder,
  hideUploder,
  addUploadFile,
  removeUploadFIle,
  changeUploadFile,
} = uploaderSlice.actions;

export default uploaderSlice.reducer;
