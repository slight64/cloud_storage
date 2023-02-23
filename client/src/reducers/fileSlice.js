import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { hideLoader, showLoader } from './appReducer';
import { addUploadFile, changeUploadFile, showUploader } from './uploadReducer';

const API_URL = 'http://localhost:5000/';

export const getFiles = createAsyncThunk(
  'files/getFiles',
  async function ({ currentDir, sort = 'list' }, { dispatch }) {
    try {
      dispatch(showLoader());
      let url = `${API_URL}api/files`;
      if (currentDir) {
        url = `${API_URL}api/files?parent=${currentDir}`;
      }
      if (sort) {
        url = `${API_URL}api/files?sort=${sort}`;
      }
      if (currentDir && sort) {
        url = `${API_URL}api/files?parent=${currentDir}&sort=${sort}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(setFiles(response.data));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const createDir = createAsyncThunk(
  'files/createDir',
  async function ({ currentDir, dirName }, { dispatch }) {
    try {
      const response = await axios.post(
        `${API_URL}api/files`,
        {
          name: dirName,
          parent: currentDir,
          type: 'dir',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(addFile(response.data));
    } catch (error) {
      console.log(error);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async function ({ file, currentDir }, { dispatch }) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (currentDir) {
        formData.append('parent', currentDir);
      }
      const uploadFile = { name: file.name, progress: 0, id: Date.now() };
      dispatch(showUploader());
      dispatch(addUploadFile(uploadFile));
      const response = await axios.post(
        `${API_URL}api/files/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          onUploadProgress: (data) => {
            uploadFile.progress = Math.round((100 * data.loaded) / data.total);
            dispatch(changeUploadFile(uploadFile));
          },
        }
      );
      dispatch(addFile(response.data));
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const deleteFile = createAsyncThunk(
  'file/deleteFile',
  async function (file, { dispatch }) {
    try {
      const response = await axios.delete(
        `${API_URL}api/files?id=${file._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // dispatch(deleteFileAction(file._id));
      return file;
      alert(response.data.message);
    } catch (error) {}
  }
);

export const searchFiles = createAsyncThunk(
  'files/searchFiles',
  async function (search, { dispatch }) {
    const response = await axios.get(
      `${API_URL}api/files/search?search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    dispatch(setFiles(response.data));
    try {
    } catch (error) {}
  }
);

export const downloadFile = createAsyncThunk(
  'files/downloadFile',
  async (file) => {
    const response = await fetch(
      `${API_URL}api/files/download?id=${file._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    currentDir: null,
    popupDisplay: 'none',
    dirStack: [],
    view: 'list',
    loading: false,
  },
  reducers: {
    setFiles(state, action) {
      state.files = action.payload;
    },
    setCurrentDir(state, action) {
      state.currentDir = action.payload;
      state.dirStack.filter((item) => item !== action.payload);
    },
    addFile(state, action) {
      return { ...state, files: [...state.files, action.payload] };
    },
    setPopupDisplay(state, action) {
      state.popupDisplay = action.payload;
    },
    pushToStack(state, action) {
      state.dirStack.push(action.payload);
    },
    setFileView(state, action) {
      state.view = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFiles.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(
          (item) => item._id !== action.payload._id
        );
        state.loading = false;
      });
  },
});

export const {
  setFiles,
  setCurrentDir,
  addFile,
  setPopupDisplay,
  pushToStack,
  deleteFileAction,
  setFileView,
} = fileSlice.actions;

export default fileSlice.reducer;
