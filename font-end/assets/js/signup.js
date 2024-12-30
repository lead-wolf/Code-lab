import { API_URL } from './configuration.js'
import { setToken, getToken } from '../services/localStorageService.js'
import { getRole, logOut } from '../services/authenticationService.js'

const signForm = document.getElementById('signForm');
const notierr = document.getElementById('error-message');
const dalOkButton = document.getElementById('dal-ok');
const dalLoginButton = document.getElementById('dal-login');
const dialogform = document.getElementById('dialog');
const dalNoti = document.getElementById('dal-noti');
const dalCancelButton = document.getElementById('dal-cancel');

signForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-id-column').value;
    const password = document.getElementById('password-column').value;
    const fullName = document.getElementById('fullName').value;
    
    try {
        const response = await fetch(API_URL + 'users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, fullName, password })
        });

        const data = await response.json();

        if (response.ok && data.code === 1000) {
            dialogform.style.visibility = 'visible';
            dalLoginButton.style.display = 'inline';
        } else {
            console.error('Sign-up failed:', data.message);
            notierr.textContent = 'Đăng ký thất bại: ' + data.message;
            notierr.style.display = 'flex';
        }
    } catch (error) {
        console.error('Lỗi:', error);
        toastr.error(`Lỗi: ${error}`, 'Lỗi', {
            closeButton: true,
            progressBar: true
        });
    }
});

dalCancelButton.addEventListener('click', () => {
    dialogform.style.visibility = 'hidden';
});

window.onload = () => {
    
    
}