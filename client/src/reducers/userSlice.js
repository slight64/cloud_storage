import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/';

export const registration = createAsyncThunk(
  'user/registration',
  async function ({ email, password }, { rejectWithValue }) {
    try {
      const response = await axios.post(`${API_URL}api/auth/registration`, {
        email,
        password,
      });
      alert(response.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async function ({ email, password }, { rejectWithValue, dispatch }) {
    try {
      const response = await axios.post(`${API_URL}api/auth/login`, {
        email,
        password,
      });
      console.log('🚀 ~ file: userSlice.js:27 ~ response', response);
      localStorage.setItem('token', response.data.token);
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.log(error);
    }
  }
);

export const auth = createAsyncThunk(
  'user/auth',
  async function (_, { dispatch }) {
    try {
      const response = await axios.get(`${API_URL}api/auth/auth`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(setUser(response.data));
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      alert(error.response.data.message);
      localStorage.removeItem('token');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async function (file, { dispatch }) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        `${API_URL}api/files/avatar`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      dispatch(setUser(response.data));
    } catch (error) {}
  }
);

export const deleteAvatar = createAsyncThunk(
  'user/deleteAvatar',
  async function (_, { dispatch }) {
    try {
      const response = await axios.delete(`${API_URL}api/files/avatar`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(setUser(response.data));
    } catch (error) {}
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: '',
    isAuth: false,
  },
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuth = true;
    },
    setLoguot(state, _) {
      localStorage.removeItem('token');
      state.currentUser = {};
      state.isAuth = false;
    },
  },
});

export const { setUser, setLoguot } = userSlice.actions;

export default userSlice.reducer;
