import axios from 'axios';
import { hideLoader, showLoader } from '../reducers/appReducer';
import { addFile, deleteFileAction, setFiles } from '../reducers/fileReducer';
import {
  addUploadFile,
  changeUploadFile,
  showUploader,
} from '../reducers/uploadReducer';

export function getFiles(dirId, sort) {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      let url = `${API_URL}api/files`;
      if (dirId) {
        url = `${API_URL}api/files?parent=${dirId}`;
      }
      if (sort) {
        url = `${API_URL}api/files?sort=${sort}`;
      }
      if (dirId && sort) {
        url = `${API_URL}api/files?parent=${dirId}&sort=${sort}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // console.log('response', response.data);
      dispatch(setFiles(response.data));
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      //При загрузке файлов, лоадер не пропадал
      dispatch(hideLoader());
    }
  };
}

export function createDir(dirId, name) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${API_URL}api/files`,
        {
          name,
          parent: dirId,
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
      alert(error.response.data.message);
    }
  };
}

export function uploadFile(file, dirId) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (dirId) {
        formData.append('parent', dirId);
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
    } catch (e) {
      alert(e?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };
}

export async function downloadFile(file) {
  const response = await fetch(`${API_URL}api/files/download?id=${file._id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
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

export function deleteFile(file) {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API_URL}api/files?id=${file._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(deleteFileAction(file._id));
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };
}

export function searchFiles(search) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${API_URL}api/files/search?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(setFiles(response.data));
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      dispatch(hideLoader());
    }
  };
}
