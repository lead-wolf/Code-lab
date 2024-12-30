import  * as lcServices  from "/assets/services/localStorageService.js"
import { API_URL } from "/assets/js/configuration.js"

let users = [];
let listItem = [];
let selectedUserIndex;
let currentPage = 1;

const itemsPerPage = 10;

async function fetchUser() {
    try {
        const response = await fetch(`${API_URL}users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${lcServices.getToken()}`
            }
        });

        const data = await response.json();

        if (response.ok && data.code === 1000) {
            users = data.result;
            listItem = users
            displayPage(currentPage)
        } else {
            console.error('Failed to fetch users:', data.message || 'Unknown error');
            toastr.error(`Lỗi kết nối với server`, 'Lỗi', {
                closeButton: true,
                progressBar: true
            });
        }
    } catch (error) {
        console.error('Error:', error);
        toastr.error(`Đã xảy ra lỗi khi tải danh sách người dùng. Vui lòng thử lại.`, 'Lỗi', {
            closeButton: true,
            progressBar: true
        });
    }
}

function populateUserTable(users) {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; 

    users.forEach((user, index) => {
        const row = createUserRow(user, index);
        userTableBody.appendChild(row);
    });
}

function createUserRow(user, index) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><a style="font-weight: bold" class="text-body fw-bold">${index + 1}</a></td>
        <td>${user.email}</td>
        <td>${user.fullName}</td>
        <td class="${user.active ? 'text-success' : 'text-danger'}">
            ${user.active ? 'Hoạt Động' : 'Chưa kích hoạt'}
        </td>
        <td>${user.roles.join(', ')}</td>
        <td>
            ${user.email === 'admin' ? '' : '<button class="text-primary edit-btn">✍🏻</button>'}
        </td>
    `;

    if(user.email !== 'admin')
        row.querySelector('.edit-btn').addEventListener('click', () => openEditPopup(index));

    return row;
}

function openEditPopup(index) {
    const user = users[index];

    document.getElementById('accountStatus').value = user.active.toString();
    document.getElementById('roleAdmin').checked = user.roles.includes("ADMIN");
    document.getElementById('roleTeacher').checked = user.roles.includes("TEACHER");
    document.getElementById('roleUser').checked = user.roles.includes("USER");

    document.getElementById('popup-user').style.display = 'flex';
    selectedUserIndex = index;
}

function closePopup() {
    document.getElementById('popup-user').style.display = 'none';
}

function saveChanges() {
    const accountStatus = document.getElementById('accountStatus').value === 'true';
    const roles = [];
    
    if (document.getElementById('roleAdmin').checked) roles.push("ADMIN");
    if (document.getElementById('roleTeacher').checked) roles.push("TEACHER");
    if (document.getElementById('roleUser').checked) roles.push("USER");


    const updatedUser = {
        active: accountStatus,
        roles: roles
    };

    fetch(API_URL + 'users/' + users[selectedUserIndex].id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lcServices.getToken()}` 
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        }
        toastr.error(`Lỗi cập nhật thông tin người dùng`, 'Lỗi', {
            closeButton: true,
            progressBar: true
        });
        throw new Error('Lỗi cập nhật thông tin người dùng');
    })
    .then(data => {
        toastr.success(`Cập nhật thành công!`, 'Thông báo', {
            closeButton: true,
            progressBar: true
        });
        console.log('Cập nhật thành công:', data);
        closePopup(); 
        fetchUser(); 
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi:', error);
        toastr.error(`Cập nhật không thành công. Vui lòng thử lại.`, 'Lỗi', {
            closeButton: true,
            progressBar: true
        });
        closePopup(); 
        fetchUser();
    });
}

function displayPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const itemsToShow = listItem.slice(start, end);
    
    populateUserTable(itemsToShow)
    updatePagination();
}

function updatePagination() {
    const totalItems = listItem.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    document.getElementById('totalItems').innerText = `Tổng số mục: ${totalItems}`;
    
    const pageLinks = document.getElementById('pageLinks');
    pageLinks.innerHTML = `Trang ${currentPage} / ${totalPages}`;

    document.getElementById('nextLink').style.visibility = currentPage < totalPages ? 'visible' : 'hidden';
    document.getElementById('lastLink').style.visibility = currentPage <= totalPages && currentPage > 1 ? 'visible' : 'hidden';
}

document.getElementById('nextLink').addEventListener('click', () => {
    if (currentPage < Math.ceil(listItem.length / itemsPerPage)) {
        currentPage++;
        displayPage(currentPage);
    }
});

document.getElementById('lastLink').addEventListener('click', () => {
    if (currentPage > 1 ) {
        currentPage--;
        displayPage(currentPage);
    }
});

document.getElementById('searchUserInput').addEventListener('input', (event) => {
    const keyword = event.target.value.toLowerCase(); 
    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(keyword) || 
        user.fullName.toLowerCase().includes(keyword)
    );
    if (keyword.trim() === ""){
        listItem = users;
        displayPage(currentPage);
        return;
    }
    listItem = filteredUsers;
    currentPage = 1;
    displayPage(currentPage);
    // populateUserTable(filteredUsers);
});

document.getElementById('closePopupBtn').addEventListener('click', closePopup);
document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);

window.onload = () => {
    fetchUser(); 
}

