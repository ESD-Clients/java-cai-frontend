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
