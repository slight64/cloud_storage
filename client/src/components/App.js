import React, { useEffect } from 'react';
import Navbar from './navbar/Navbar';
import './app.less';
import Registration from './authorization/Registration';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './authorization/Login';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../action/user';
import Disk from './disk/Disk';
import Profile from './profile/Profile';

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(auth());
  }, []);
  return (
    <div className="app">
      <Navbar />
      <div className="wrap">
        {!isAuth ? (
          <Routes>
            <Route path="/registration" element={<Registration />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<Navigate replace to="/" />} />
            <Route path="/" element={<Disk />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
