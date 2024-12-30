import  * as lcServices  from "/assets/services/localStorageService.js"
import { API_URL } from "/assets/js/configuration.js"

let assignments = [];
let listItemShow = [];
let assignmentindex;
let currentPage = 1;

const itemsPerPage = 10;

//  function loadComponent(url, elementId) {

//     fetch(url)
//     .then(response => {
//         if (response.ok) {
//             return response.text();
//         }else{
//             throw new Error(`error! status: ${response.status}`);
//         }
//     }).then(data => {
//         document.getElementById(elementId).innerHTML = '';
//         document.getElementById(elementId).innerHTML = data;
//     }).catch( error =>{
//         console.error('Error loading component:', error);
//     })
// }

// function loadResources() {
//     let index = 0;

//     const styles = [
//         '/admin_assets/vendor/bootstrap/css/bootstrap.min.css',
//         '/admin_assets/css/multi-step-form.css',
//         '/admin_assets/vendor/summernote/summernote-bs4.css',
//         '/admin_assets/vendor/markdown/simplemde.min.css',
//         '/admin_assets/css/main.css'
//     ];

//     const scripts = [
//         '/admin_assets/vendor/jquery/jquery.min.js',
//         '/admin_assets/vendor/markdown/simplemde.min.js',
//         '/admin_assets/vendor/popper.min.js',
//         '/admin_assets/vendor/bootstrap/js/bootstrap.min.js',
//         '/admin_assets/vendor/summernote/summernote-bs4.min.js',
//         '/admin_assets/vendor/js-init/init-summernote.js',
//         '/admin_assets/js/validate.js',
//         '/admin_assets/js/multl-step-form.js',
//         '/admin_assets/vendor/js-init/init-markdown.js',
//         '/admin_assets/js/scripts.js'
//     ];

//     // Load CSS
//     styles.forEach(href => {
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = href;
//         link.onload = () => {
//             console.log(`${href} loaded successfully`);
//         };
//         link.onerror = () => {
//             console.error(`Failed to load ${href}`);
//         };
//         document.head.appendChild(link);  
//     });

//     // Load JS with recursion
//     function loadNextScript() {
//         if (index < scripts.length) {
//             const script = document.createElement('script');
//             script.src = scripts[index];
//             script.onload = () => {
//                 console.log(`${scripts[index]} loaded successfully`);
//                 index++; 
//                 loadNextScript(); 
//             };
//             script.onerror = () => {
//                 console.error(`Failed to load ${scripts[index]}`);
//                 index++; 
//                 loadNextScript(); 
//             };
//             document.body.appendChild(script); 
//         } else {
//             loadScriptModule();
//         }
//     }

//     // Load JS Module
//     function loadScriptModule(){
//         const script = document.createElement('script');
//         script.src = '/admin_assets/js/assignment_add.js';
//         script.type = 'module';
//         script.onload = () => {
//             console.log(`/admin_assets/js/assignment_add.js loaded successfully`);
//         };
//         script.onerror = () => {
//             console.error(`Failed to load /admin_assets/js/assignment_add.js`);
//         };
//         document.body.appendChild(script);
//     }

//     loadNextScript();
// }

// document.querySelector('.btn-success').addEventListener('click', () => {
//     console.log('run');
//     loadComponent('/admin/assignment/add.html', 'context');
//     loadResources();
//         //other

    
// });

async function fetchAssignment() {
    try {
        const response = await fetch(`${API_URL}assignments`,{
            method: 'GET',
            headers: {
                'Context-Type': 'application/json',
                'Authorization': `Bearer ${lcServices.getToken() }`
            }
        })

        const data = await response.json();
        if (response.ok && data.code === 1000){
            assignments = data.result;
            listItemShow = assignments;
            displayPage(currentPage);

            localStorage.setItem("assignments", JSON.stringify(assignments));
            // const storedAssignments = JSON.parse(localStorage.getItem("assignments"));
            // console.log(storedAssignments[2]);
        }
    } catch (error) {
        console.error('Failed to fetch:', error.message || 'Unknown error');
        toastr.error('Lỗi kết nối với server', 'Lỗi',{
            closeButton: true,
            ProgressBar: true
        })
    }
}

function displayPage(page){
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const itemsToShow = listItemShow.slice(start, end);
    
    addRowToTbale(itemsToShow)
    updatePagination();
}

function addRowToTbale(listItem){
    const table = document.getElementById('assignmentTable');
    table.innerHTML = '';

    listItem.forEach( (item, index)  => {
        const row = createRow(item, index);
        table.appendChild(row);
    });
}

function createRow(item, index){
    const row = document.createElement('tr');
    if(!item.language){
        item.language = 'Select by user';
    }

    row.innerHTML = `
        <td><a style="font-weight: bold" class="text-body fw-bold"><span">${index+1}</span></a></td>
        <td>${item.title}</td>
        <!--td class="full-desc">${item.description}</td-->
        <td>
            ${item.language}
        </td>
        <td>
            ${item.level}
        </td>
        <td>
            <button class="text-primary edit-btn">✍🏻</button>
            <button class="text-primary remove-btn">🗑️</button>
        </td>
    `;
    
    row.querySelector('.edit-btn').addEventListener('click', () => window.location.href = `/admin/assignment/edit.html?id=${item.id}`);
    row.querySelector('.remove-btn').addEventListener('click', () => {
        deleteAssignment(item.id);
    });

    return row;
}

function updatePagination(){
    const totalItems = assignments.length;
    const totalPages = Math.ceil(totalItems/itemsPerPage);

    document.getElementById('totalItemsAssignment').innerText = `Tổng số mục: ${totalItems}`;
    document.getElementById('pageLinksAssignment').innerText = `Trang ${currentPage} / ${totalPages}`;
    document.getElementById('nextLinkAssignment').style.visibility = currentPage < totalPages ? 'visible' : 'hidden';
    document.getElementById('lastLinkAssignment').style.visibility = currentPage <= totalPages && currentPage > 1 ? 'visible' : 'hidden';
}

function deleteAssignment(id){
    $.ajax({
        url: `${API_URL}assignments/${id}`,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${lcServices.getToken()}`, 
        },
        
        success: function(response){
            toastr.success('Đã xoá bải tập!', 'Thành công!', {
                closeButton: true,
                ProgressBar: true,
                timeOut: 5000
            });
            fetchAssignment();            
        },

        error: function(error){
            console.log('Error: ', error.responseJSON?.message);
            toastr.error('Lỗi khi xoá bải tập!', 'Lỗi', {
                closeButton: true,
                ProgressBar: true,
                timeOut: 5000
            });
        }
    })
}

document.getElementById('nextLinkAssignment').addEventListener('click', () => {
    if(currentPage < Math.ceil(listItemShow.length / itemsPerPage)){
        currentPage++;
        displayPage(currentPage);
    }
});

document.getElementById('lastLinkAssignment').addEventListener('click', () => {
    if(currentPage > 1){
        currentPage--;
        displayPage(currentPage);
    }
})

document.getElementById('searchInput').addEventListener('input', (event) => {
    const keyword = event.target.value.toLowerCase(); 
    const filteredUsers = assignments.filter(obj => 
        obj.title.toLowerCase().includes(keyword) || 
        obj.level.toLowerCase().includes(keyword) ||
        obj.language.toLowerCase().includes(keyword)
    );
    if (keyword.trim() === ""){
        listItemShow = assignments;
        displayPage(currentPage);
        return;
    }
    listItemShow = filteredUsers;
    currentPage = 1;
    displayPage(currentPage);
});

window.onload = () => {
    fetchAssignment();
}