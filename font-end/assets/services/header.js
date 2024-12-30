import { removeToken, getToken, setToken } from "/assets/services/localStorageService.js";; 
import {API_URL} from "/assets/js/configuration.js"
import { checkAccessToken } from "./authenticationService.js";

window.onload = function()  {

    if (getToken()) {
        checkAccessToken();
    }
    
    if (!getToken() || !localStorage.getItem('loginTime')) {
        window.location.href = '/sign-in.html'; // Thay đổi URL tùy theo trang login của bạn
        return;
    }
};