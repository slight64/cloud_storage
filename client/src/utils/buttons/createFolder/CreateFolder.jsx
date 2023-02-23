import React from 'react';
import { useDispatch } from 'react-redux';
import { setPopupDisplay } from '../../../reducers/fileSlice';

const CreateFolder = () => {
  const dispatch = useDispatch();
  const showPopupHandler = () => {
    dispatch(setPopupDisplay('flex'));
  };
  return (
    <div>
      <button className="disk__create" onClick={showPopupHandler}>
        Создать папку
      </button>
    </div>
  );
};

export default CreateFolder;
