import { API_URL } from './configuration.js'
import { setToken, getToken, setUsername } from '../services/localStorageService.js'
import { getRole, logOut } from '../services/authenticationService.js'

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const notierr = document.getElementById('alert-error');
    const alertSuccess = document.getElementById('alert-success').style.display = 'none';

    try {
        const response = await fetch(API_URL + 'auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.code === 1000) {
            setToken(data.result.token);
            getInfor();
        } else {
            if (data.code === 1014) {
                notierr.style.display = 'flex';
            }else{
                notierr.style.display = 'none';
                toastr.error(data.message, 'lỗi',{
                    closeButton: true,
                    progressBar: true
                });
            }
        }
    } catch (error) {
        toastr.error(`Lỗi khi kết nối đến server`, 'Lỗi', {
            closeButton: true,
            progressBar: true
        });
        console.error('Lỗi:', error);
    }
});

function getInfor(){
    fetch(API_URL + 'users/my-info',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .then(response => {
            if(response.ok)
                return response.json();
        })
        .then(data => {
             if(data.code === 1000){
                const now = new Date().getTime();
                localStorage.setItem('loginTime', now);
                setUsername(data.result.fullName);
                window.location.href = getRole() === "ROLE_ADMIN" ? "/admin" : "/";
             }
        })
        .catch(error => {
            console.error('có lỗi xảy ra');
            toastr.error(`Lỗi: ${error}`, 'Lỗi', {
                closeButton: true,
                progressBar: true
            });
        })
}

window.onload = () => {
    if( getToken() ){
        document.getElementById('alert-success').style.display = 'flex';
        logOut();
    }
    
}