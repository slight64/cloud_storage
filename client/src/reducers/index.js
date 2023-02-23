import { combineReducers, createStore, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import thunk from 'redux-thunk';
// import fileReducer from './fileReducer';
import fileReducer from './fileSlice';
// import userReducer from './userReducer';
import userReducer from './userSlice';
import uploadReducer from './uploadReducer';
import appReducer from './appReducer';

const rootReducer = combineReducers({
  user: userReducer,
  files: fileReducer,
  upload: uploadReducer,
  app: appReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
// export const store = createStore(
//   rootReducer,
//   composeWithDevTools(applyMiddleware())
// );
