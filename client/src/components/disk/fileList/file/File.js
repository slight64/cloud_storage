import React from 'react';
import './file.less';
import dirLogo from '../../../../assets/img/dir.svg';
import fileLogo from '../../../../assets/img/file.svg';
import { pushToStack, setCurrentDir } from '../../../../reducers/fileReducer';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFile, downloadFile } from '../../../../action/file';
import sizeFormat from '../../../../utils/sizeFormat';

const File = ({ file }) => {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const fileView = useSelector((state) => state.files.view);

  function openDirHandler() {
    // console.log('file', file.type);
    dispatch(pushToStack(currentDir));
    dispatch(setCurrentDir(file._id));
  }

  function downloadClickHanler(event) {
    event.stopPropagation();
    downloadFile(file);
  }

  function deleteClickHandler(event) {
    event.stopPropagation();
    dispatch(deleteFile(file));
  }

  if (fileView === 'list') {
    return (
      <div
        className="file"
        onClick={file.type === 'dir' ? () => openDirHandler() : () => {}}
      >
        <img
          src={file.type === 'dir' ? dirLogo : fileLogo}
          alt=""
          className="file__img"
        />
        <div className="file__name">{file.name}</div>
        <div className="file__date">{file.date.slice(0, 10)}</div>
        <div className="file__size">{sizeFormat(file.size)}</div>
        {file.type !== 'dir' && (
          <button
            onClick={(event) => downloadClickHanler(event)}
            className="file__btn file__download"
          >
            Скачать
          </button>
        )}
        <button
          onClick={(event) => deleteClickHandler(event)}
          className="file__btn file__delete"
        >
          Удалить
        </button>
      </div>
    );
  }

  if (fileView === 'plate') {
    return (
      <div
        className="file-plate"
        onClick={file.type === 'dir' ? () => openDirHandler() : () => {}}
      >
        <img
          src={file.type === 'dir' ? dirLogo : fileLogo}
          alt=""
          className="file-plate__img"
        />

        <div className="file-plate__name">{file.name}</div>
        <div className="file-plate__btns">
          {' '}
          {file.type !== 'dir' && (
            <button
              onClick={(event) => downloadClickHanler(event)}
              className="file-plate__btn file__download"
            >
              Скачать
            </button>
          )}
          <button
            onClick={(event) => deleteClickHandler(event)}
            className="file-plate__btn file__delete"
          >
            Удалить
          </button>
        </div>
      </div>
    );
  }
};

export default File;
