import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { createDir } from '../../action/file';
// import { setCurrentDir, setPopupDisplay } from '../../reducers/fileReducer';
import {
  setCurrentDir,
  setPopupDisplay,
  createDir,
} from '../../reducers/fileSlice';
import Input from '../../utils/input/Input';

const Popup = () => {
  const [dirName, setDirName] = useState('');
  const popupDisplay = useSelector((state) => state.files.popupDisplay);
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const typeName = useSelector((state) => state);
  function createHandler() {
    dispatch(createDir({ currentDir, dirName }));
    setDirName('');
    dispatch(setPopupDisplay('none'));
  }
  // console.log(dirName, typeName);
  // console.log('[popup', popupDisplay);
  // console.log('[currentDir', currentDir);
  return (
    <div
      className="popup"
      onClick={() => {
        dispatch(setPopupDisplay('none'));
      }}
      style={{ display: popupDisplay }}
    >
      <div
        className="popup__content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="popup__header">
          <div className="popup__title">Создать новую папку</div>
          <button
            className="popup__button"
            onClick={() => {
              dispatch(setPopupDisplay('none'));
            }}
          >
            X
          </button>
        </div>
        <Input
          type="text"
          placeholder="Введите название папки"
          value={dirName}
          setValue={setDirName}
        />
        <button className="popup__create" onClick={() => createHandler()}>
          Создать
        </button>
      </div>
    </div>
  );
};

export default Popup;
