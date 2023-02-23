import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles, uploadFile } from '../../reducers/fileSlice';
import FileList from './fileList/FileList';
import './disk.less';
import Popup from './Popup';
import {
  setCurrentDir,
  setFileView,
  setPopupDisplay,
} from '../../reducers/fileSlice';

import Uploader from './uploader/Uploader';

const Disk = () => {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const dirStack = useSelector((state) => state.files.dirStack);
  const isLoading = useSelector((state) => state.files.loading);
  const [dragEnter, setDragEnter] = useState(false);
  const [sort, setSort] = useState('type');
  const loader = useSelector((state) => state.app.loader);

  useEffect(() => {
    dispatch(getFiles({ currentDir, sort }));
  }, [currentDir, sort]);

  function showPopupHandler() {
    dispatch(setPopupDisplay('flex'));
  }

  function backClickHandler() {
    // Проверить насколько верное решение принято при изменении массива в стейте для того, чтобы вернуться на уровень назад
    const backDirId = dirStack[dirStack.length - 1];
    dispatch(setCurrentDir(backDirId));
  }

  function fileUploadHandler(event) {
    const files = [...event.target.files];
    files.forEach((file) => dispatch(uploadFile({ file, currentDir })));
  }

  function dragEnterHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  }

  function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(false);
  }

  function dragOverHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  }

  function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    let files = [...event.dataTransfer.files];
    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    setDragEnter(false);
  }

  if (isLoading === true) {
    return (
      <div className="loader">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return !dragEnter ? (
    <div
      className="disk"
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <div className="disk__btns">
        <button className="disk__back" onClick={() => backClickHandler()}>
          Назад
        </button>
        <button className="disk__create" onClick={() => showPopupHandler()}>
          Создать папку
        </button>
        <div className="disk__upload">
          <label htmlFor="disk__upload-input" className="disk__upload-label">
            Загрузить фаил
          </label>
          <input
            multiple={true}
            onChange={(event) => fileUploadHandler(event)}
            type="file"
            className="disk__upload-input"
            id="disk__upload-input"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="disk__select"
        >
          <option value="name">По имени</option>
          <option value="type">По типу</option>
          <option value="date">По дате</option>
        </select>
        <button
          className="disk__plate"
          onClick={() => {
            dispatch(setFileView('plate'));
          }}
        />
        <button
          className="disk__list"
          onClick={() => {
            dispatch(setFileView('list'));
          }}
        />
      </div>
      <FileList />
      <Popup />
      <Uploader />
    </div>
  ) : (
    <div
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
      className="drop-area"
    >
      Перетащите сюда файлы
    </div>
  );
};

export default Disk;
