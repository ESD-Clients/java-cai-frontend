import firebase from "firebase/app";
import CryptoJS from "crypto-js";

export const setCurrentUser = (user) => {
  let value = JSON.stringify(user);
  window.localStorage.setItem("java-cai-usr", value);
};

export const getCurrentUser = () => {
  let value = window.localStorage.getItem("java-cai-usr");
  if (value) {
    return JSON.parse(value);
  } else {
    return "";
  }
};

export const logout = () => {
  window.localStorage.removeItem("java-cai-usr");
};

//
export const getEventFormData = (e) => {
  let formData = new FormData(e.target);
  let values = Object.fromEntries(formData.entries());

  return values;
}

export const isPasswordValid = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
  return passwordRegex.test(password);
};

export const setPlaygroundCode = (code) => {
  window.localStorage.setItem("playground-code", code);
}

export const getPlaygroundCode = () => {
  return window.localStorage.getItem("playground-code");
}

export const clearPlaygroundCode = () => {
  window.localStorage.removeItem("playground-code");
}

/** FIREBASE */
export const getDocData = (doc) => {
  let item = doc.data();
  item.id = doc.id;

  return item;
}

export const getErrorMessage = (err) => {

  return err.message ? err.message :
    err.code ? err.code :
    "Something went wrong!";
}

export const getCurrentTimestamp = () => {
  const timestamp = firebase.firestore.Timestamp.now();
  return timestamp.toMillis();
};

export const hashData = (data) => {
  let hashedData = CryptoJS.SHA256(data).toString();
  return hashedData;
}

/** MEDIA */
export function getFileType(file) {
  const fileType = file.type;
  if (fileType.startsWith('image/')) {
    return "image";
  } else if (fileType.startsWith('video/')) {
    return "video";
  } else {
    return fileType;
  }
}