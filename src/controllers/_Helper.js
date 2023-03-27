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