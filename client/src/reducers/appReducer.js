const SHOW_UPLOADER = 'SHOW_UPLOADER';
const HIDE_UPLOADER = 'HIDE_UPLOADER';

const defaultState = {
  loader: false,
};

export default function appReducer(state = defaultState, action) {
  switch (action.type) {
    case SHOW_UPLOADER:
      return { ...state, loader: true };
    case HIDE_UPLOADER:
      return { ...state, loader: false };
    default:
      return state;
  }
}

export const showLoader = () => ({ type: SHOW_UPLOADER });
export const hideLoader = () => ({ type: HIDE_UPLOADER });
