import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteAvatar, uploadAvatar } from '../../action/user';

const Profile = () => {
  const dispatch = useDispatch();
  function changeHandler(event) {
    const file = e.target.files[0];
    dispatch(uploadAvatar(file));
  }
  return (
    <div>
      <button onClick={dispatch(deleteAvatar())}>Удалить аватар</button>
      <input
        onChange={(event) => changeHandler(event)}
        accept="image/*"
        type="file"
        placeholder="Загрузить аватар"
      />
    </div>
  );
};

export default Profile;
