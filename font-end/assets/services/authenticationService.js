import { removeToken, getToken, setToken } from "./localStorageService.js";; 
import {API_URL} from "../js/configuration.js"

export const logOut = () => {
  fetch(API_URL + 'auth/logout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify( getToken() )
  });
  removeToken();
  localStorage.clear();
};

export const parseJwt = () =>{
  const token = getToken()
  // Tách token thành các phần
  const parts = token.split('.');
  
  // Kiểm tra xem token có đủ 3 phần không
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }

  // Giải mã phần payload
  const payload = parts[1];
  
  // Thêm padding nếu cần thiết
  const padding = '='.repeat((4 - payload.length % 4) % 4);
  const base64 = payload + padding;

  // Giải mã base64
  const decodedPayload = JSON.parse(atob(base64));

  return decodedPayload;
}

export const getRole = () =>{
  try {
    const decoded = parseJwt();
    return decoded.scope;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const checkAccess = () => {
  if(!getToken())
  {
    window.location.href = "/sign-in.html";
    return;
  }
  getRole() !== "ROLE_ADMIN" ? window.location.href= "/err/403.html" : "";
}

export const getAccessToken = () => {
  fetch(`${API_URL}auth/token`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) 
      return response.json
  })
  .then(data => {
    if (data.code === 1000) {
      setToken(data.result.token);
      const loginTime = Date.now;
      localStorage.setItem("loginTime", loginTime);
    }
  }).catch(err => {
    console.error('có lỗi xảy ra', err);
  })
}

export const getRefreshToken = () => {
  fetch(`${API_URL}auth/refresh`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( getToken() )
  })
  .then(response => {
    if (response.ok) 
      return response.json();
  })
  .then(data => {
    if (data.code === 1000) {
      setToken(data.result.token);
      const loginTime = Date.now();
      localStorage.setItem("loginTime", loginTime);
    }
  }).catch(err => {
    localStorage.clear();
    window.location.href = "/sign-in.html";
    console.error('có lỗi xảy ra', err);
  })
}

export const checkAccessToken = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
      const now = new Date().getTime();
      const accessHour = 3600000; 
      const refreshHour = 5400000;
      const minRefresh = 900000;
      const operating = now - loginTime;

      if (operating > refreshHour) {
          toastr.error(`Phiên đăng nhập hết hạn vui lòng đăng nhập lại.`, 'Lỗi', {
              closeButton: true,
              progressBar: true
          });
          localStorage.clear();
          console.log('Session expired. Cleared all localStorage data.');
      } else {
          if(operating > accessHour){
              toastr.error(`Phiên đăng nhập hết hạn vui lòng đăng nhập lại.`, 'Lỗi', {
                  closeButton: true,
                  progressBar: true
              });
              console.log('abc');
              
              localStorage.clear();
          }
          if (accessHour - operating < minRefresh) {
              getRefreshToken()
              console.log('refresh token');
          }
      }
  }
}