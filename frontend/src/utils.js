import { setMessage, clearMessage } from "./reducers/notificationReducer";

export const timedMessage = async (dispatch, message, key, time = 5000) => {
  dispatch(setMessage({ message, key }));
  setTimeout(() => {
    dispatch(clearMessage(key));
  }, time);
};
