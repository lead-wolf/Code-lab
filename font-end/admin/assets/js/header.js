import { checkAccessToken, checkAccess } from "/assets/services/authenticationService.js";

/*-----------------------------------------------
                    ON INIT
-------------------------------------------------*/

async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAccessToken();
    checkAccess();
    loadComponent('/admin/assets/components/adminLayout/header.html', 'header').then(HeaderEventHandler);
    loadComponent('/admin/assets/components/adminLayout/leftSidebar.html', 'leftSidebar').then(LeftBarEventHandler);
    loadComponent('/admin/assets/components/adminLayout/rightSidebar.html', 'rightSidebar').then(RightBarEventHandler);
    loadComponent('/admin/assets/components/adminLayout/footer.html', 'footer'); 

});

function HeaderEventHandler(){
    document.querySelector('.js_left-nav-toggler').addEventListener('click', () => {
        document.body.classList.toggle('left-nav-toggle');
        if (document.body.classList.contains('left-nav-toggle')) {
            document.querySelector('.branding-wrap').style.position = 'absolute';
        } else {
            document.querySelector('.branding-wrap').style.position = 'fixed';
        }
    });

    document.querySelector(".right_side_toggle").addEventListener('click', () => {
        document.querySelector('#right_side_bar').classList.toggle('show');
    }); 
}

function LeftBarEventHandler(){
    const myPath = window.location.pathname;
    switch (myPath) {
        case '/admin/':
            document.querySelector('.dashboard').classList.toggle('active');
            break;
        case ('/admin/user/'):
            document.querySelector('.user').classList.toggle('active');
            break;
        case ('/admin/assignment/'):
            document.querySelector('.assignment').classList.toggle('active');
            break;
        case ('/admin/quiz/'):
            document.querySelector('.quiz').classList.toggle('active');
            break;
        case ('/admin/assignment_kit/'):
            document.querySelector('.assignment_kit').classList.toggle('active');
            break;
        case ('/admin/apply/'):
            document.querySelector('.apply').classList.toggle('active');
            break;
        case ('/admin/assignment_bank/'):
            document.querySelector('.assignment_bank').classList.toggle('active');
            break;
        case ('/admin/contest/'):
            document.querySelector('.contest').classList.toggle('active');
            break;
        default:
            break;
    }
}

function RightBarEventHandler(){
    document.querySelector('.close-sidebar-icon').addEventListener('click', () => {
        document.querySelector('.right-sidebar').classList.toggle('show');
    });
}
