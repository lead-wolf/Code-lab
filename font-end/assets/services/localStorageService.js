export const KEY_TOKEN = "accessToken";
export const KEY_REFRESH_TOKEN = "refeshToken";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};

export const setRefeshToken = (refeshToken) => {
  localStorage.setItem(KEY_REFRESH_TOKEN, refeshToken);
};

export const getRefeshToken = () => {
  return localStorage.getItem(KEY_REFRESH_TOKEN);
};

export const removeRefeshToken = () => {
  return localStorage.removeItem(KEY_REFRESH_TOKEN);
};

export const setUsername = (Username) => {
  localStorage.setItem("Username", Username);
};

export const getUsername = () => {
  return localStorage.getItem("Username");
};
