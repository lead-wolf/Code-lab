import {MY_CHATGPT_API_KEY} from "./config.js"
import {MY_API_KEY} from "./config.js";
import {API_URL} from "/assets/js/configuration.js"
import {getToken} from "/assets/services/localStorageService.js"

const params = new URLSearchParams(window.location.search)
const assignmentID = params.get('id');
let assessmentItem;
let testCasesItem =[];
var theme = document.getElementById("theme")

const testCasesContainer = document.getElementById('test-cases-container');
const resultSection = document.getElementById('result');
var run = document.getElementById("run")
var submit = document.getElementById("submit")
const excuting = document.getElementById('excuting');
const testCasesElement = document.getElementById('testCases');
const assignment_idElement = document.getElementById('assignment_id');
const memory_limit = document.getElementById('assignment_memory_limit');
const time_limit = document.getElementById('assignment_time_limit');
const allTestCase = document.getElementById('allTestCase');



document.addEventListener('DOMContentLoaded', function () {
    var hash = window.location.hash;
    if (hash !== '') {
        const tabToSelect = document.getElementById(window.location.hash.substr(1));
        if (tabToSelect) {
            const tab = new bootstrap.Tab(tabToSelect);
            tab.show();
        }
    }
});


$(document).ready(function () {
    document.getElementById('courseTab').addEventListener('show.bs.tab', function (event) {
        const activeTab = event.target; // Tab đang active

        if (activeTab.id === 'submission-tab') {
            window.location.hash = 'submission-tab';
            window.location.reload();
        } else {
            window.location.hash = activeTab.id;
        }
        // Kiểm tra tab và enable/disable các nút tương ứng
        // if (activeTab.value === 'locked') {
        //     if (!confirm("If you unlock the solution, your score will not be counted toward your progress.")) {
        //         event.preventDefault();
        //         console.log("Cancelled unlock");
        //     } else {
        //         const assignmentIDElement = document.getElementById("assignment_id");
        //         $.ajax({
        //             type: 'POST',
        //             url: '/api/submissions/unlock-solution',
        //             data: {
        //                 assignment_id: assignmentIDElement.value,
        //             },
        //             success: function () {

        //             },
        //             error: function (error) {
        //                 console.error('Error getting content:', error);
        //             }
        //         });
        //     }
        // }
    });

    // editor.on('change', function () {
    //     saveContent(editor.getValue().trim());
    // });
    // $.ajax({
    //     type: 'GET',
    //     url: '/api/submissions/get-content',
    //     success: function (response) {
    //         if (response!=null) {
    //             const dataJson = JSON.parse(response);
    //             const mode_receive = dataJson.mode;
    //             const content_receive = dataJson.content;
    //             const language_name_receive = dataJson.language_name;
    //             const current_input_value = 'input.dd-option-value[value="' + mode_receive + '"]';
    //             var input_to_change = document.querySelector(current_input_value);
    //             var selectedInput = document.querySelector('a.dd-option-selected');
    //             var dSelectedValue = document.querySelector('input.dd-selected-value');
    //             var dSelectedText = document.querySelector('label.dd-selected-text');
    //             if (mode_receive === "text/x-c++src") {
    //                 dSelectedText.innerHTML = "C++";
    //             }
    //             if (mode_receive === "text/x-java") {
    //                 dSelectedText.innerHTML = "Java";
    //             }
    //             if (mode_receive === "text/x-csharp") {
    //                 dSelectedText.innerHTML = "C#";
    //             }
    //             if (mode_receive === "text/x-python") {
    //                 dSelectedText.innerHTML = "Python";
    //             }

    //             if (input_to_change) {
    //                 var parentA = input_to_change.closest('a');
    //                 // Kiểm tra xem có thẻ a được tìm thấy không
    //                 if (parentA) {
    //                     dSelectedValue.value = mode_receive;
    //                     selectedInput.classList.remove('dd-option-selected');
    //                     // Xoá class "dd-option-selected" khỏi thẻ a
    //                     parentA.classList.add('dd-option-selected');
    //                     console.log('Đã add class "dd-option-selected" từ thẻ a.');
    //                 } else {
    //                     console.log('Không tìm thấy thẻ a chứa input.');
    //                 }
    //             } else {
    //                 console.log('Không tìm thấy thẻ input có giá trị là "input_value".');
    //             }

    //             editor.setOption("mode", mode_receive);
    //             console.log('content_receive');
    //             editor.setValue(content_receive);
    //             if (mode_receive === "text/x-c++src") {
    //                 option = 54;
    //             }
    //             if (mode_receive === "text/x-java") {
    //                 option = 91;

    //             }
    //             if (mode_receive === "text/x-csharp") {
    //                 option = 51;
    //             }
    //             if (mode_receive === "text/x-python") {
    //                 option = 71;
    //             }
    //             langague_name = language_name_receive;
    //         }
    //     },
    //     error: function (error) {
    //         console.error('Error getting content:', error);
    //     }
    // });
    init();    
    initEditer("1");
});

// function saveContent(content) {
//     // Lấy thẻ input đầu tiên có class "dd-option-selected" trong thẻ a
//     var selectedInput = document.querySelector('a.dd-option-selected input.dd-option-value');
//     $.ajax({
//         type: 'POST',
//         url: '/api/submissions/save-content',
//         data: {
//             content: content,
//             mode: selectedInput.value,
//             langague_name: langague_name,
//             current_tab_id: "-1"
//         },
//         success: function (response) {
//             console.log('Content saved successfully!');
//         },
//         error: function (error) {
//             console.error('Error saving content:', error);
//         }
//     });
// }

// function encode(str) {
//     return btoa(unescape(encodeURIComponent(str || "")));
// }

// function decode(bytes) {
//     var escaped = escape(atob(bytes || ""));
//     return decodeURIComponent(escaped);

// }
// async function generateAssessment() {
//     const prompt_text = "Hãy đưa ra nhận xét về đoạn code sau đây:"
//     const source = editor.getValue().trim();
//     const prompt_send = prompt_text+source;
//     const url = 'https://simple-chatgpt-api.p.rapidapi.com/ask';
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-RapidAPI-Key': MY_CHATGPT_API_KEY,
//             'X-RapidAPI-Host': 'simple-chatgpt-api.p.rapidapi.com'
//         },
//         body: JSON.stringify({
//             question: prompt_send
//         })
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         const outputElement = document.getElementById("chatgpt_response");
//         const assessmentBtn = document.getElementById("assessmentBtn");
//         const chatgpt_response_container = document.getElementById("chatgpt_response_container");
//         assessmentBtn.remove();
//         chatgpt_response_container.style.display = "block";
//         const chatgpt_loading = document.getElementById(`chatgpt_loading`);
//         chatgpt_loading.remove();
//         outputElement.innerHTML = result.answer;

//     } catch (error) {
//         console.error(error);
//     }
// }

function errorSystem(){
    toastr.error("Có lỗi xảy ra", "Lỗi", {
        closeButton: true,
        progressBar: true,
        setTimeout: 500,
        onHidden: () => {
                window.location.href = "/client/problem/problemSolving"
        }
    });
}

function addData(){
    $('#language-option').text(assessmentItem.language ? assessmentItem.language : "Optional Language");
    $('#challenge-title').text(assessmentItem.title ? assessmentItem.title : 'a');
    $('#lecturer-name').text(assessmentItem.lecturer ? assessmentItem.lecturer : '');
    $('#submissions-div').show();
    $('#submissions-count').text(assessmentItem.Submissions ? assessmentItem.Submissions : "0" + " submitted");
    $('#assessment-description').html(assessmentItem.description ? assessmentItem.description : '');

    if (assessmentItem.level) {
        $('#level-div').show();
        $('#level-name').text(assessmentItem.level);
    } else {
        $('#level-div').hide();
    }

    // Kiểm tra và hiển thị bộ nhớ
    if (assessmentItem.memoryLimit != 0) {
        $('#memory-div').show();
        $('#memory-limit').text(assessmentItem.memoryLimit + " KB");
    } else {
        $('#memory-limit').text("N/A");
    }

    // Kiểm tra và hiển thị thời gian
    if (assessmentItem.timeLimit != 0) {
        $('#time-div').show();
        $('#time-limit').text(assessmentItem.timeLimit + "s");
    } else {
        $('#time-limit').text("N/A");
    }

    if (assessmentItem.lecturer) {
        $('#teacher-avatar').attr('src', assessmentItem.lecturer.getImagesPath());
    } else {
        $('#teacher-avatar').attr('src', 'https://bootdey.com/img/Content/avatar/avatar1.png');
    }

    if (assessmentItem.solution) {
        $('#solution-tab').show();
        if (assessmentItem.unlocked) {
            $('#solution-tab').text('Đã mở khoá đáp án');
            $('#solution-tab').find('i').removeClass('fal fa-question-circle').addClass('fal fa-check');
            $('#solution-tab span').text('Đã mở khoá đáp án');
        } else {
            $('#solution-tab').hide();
            $('#solution-tab-locked').show();
            $('#solution-tab-locked').text('Gợi ý');
            $('#solution-tab-locked').find('i').removeClass('fal fa-check').addClass('fal fa-question-circle');
            $('#solution-tab-locked span').text('Gợi ý');
        }
    } else {
        $('#solution-list-item').hide();
    }
}

function getTestCase(){
    $.ajax({
        url: `${API_URL}testcase/all/${assignmentID}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'authorization': `Bearer ${getToken()}`
        },
        data: JSON.stringify(''),

        success: function (response) {
            if (response.code == 1000) {
                testCasesItem = response.result;
                console.log(assessmentItem);
                console.log(testCasesItem);
                addData();
            }
            else{
                errorSystem();
            }
        },
        error: function (error) {
            console.log('lỗi: ', error); 
            errorSystem();
        }
    });
}

function init(){
    console.log("init");
    
    if (!assignmentID) {        
        errorSystem();
    }

    $.ajax({
        url: `${API_URL}assignments/${assignmentID}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'authorization': `Bearer ${getToken()}`
        },
        data: JSON.stringify(''),

        success: function (response) {
            if (response.code == 1000) {
                assessmentItem = response.result;
                getTestCase();
            }
            else{
                errorSystem();
            }
        },

        error: function (error) {
            console.log('lỗi: ', error); 
            errorSystem();
        }
    });
}

function initEditer(selectedData){   
    if (selectedData === "1") {
        editor.setOption("mode", "text/x-java")
        editor.setValue('import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n      System.out.println(\"Hello world!\");\n    }\n}')
        option = 62;
    }
    if (selectedData === "2") {
        editor.setOption("mode", "text/x-csharp");
        editor.setValue("using System;\n\nclass Program {\n   static void Main() {\n     Console.WriteLine(\"Hello world!\");\n   }\n}");
        option = 51;

    }
    if (selectedData === "3") {
        editor.setOption("mode", "text/x-python")
        editor.setValue("print('Hello world!')")
        option = 71;
    }

    if (selectedData === "4") {
        editor.setOption("mode", "text/x-c++src")
        editor.setValue("#include<iostream>\n\nint main() {\n  std::cout << \"Hello world!\";\n\n  return 0;\n}")
        option = 54;
    }
}

function compile_code(testCase){
    const dataRequest = {
        language_id: option,
        source_code: editor.getValue().trim(),
        stdin: testCase.input || '',
        expected_output: testCase.expectedOutput || '',
        cpu_time_limit: 2,
        memory_limit: assessmentItem.memoryLimit > 0 ? assessmentItem.memoryLimit : null
    };
    console.log(dataRequest);
    
    $.ajax({
        url: 'http://binhan.serveftp.com:2358/submissions?base64_encoded=false&fields=*',
        type: 'POST',
        contentType: 'application/json',
        // headers: {
        //     'X-RapidAPI-Key': MY_API_KEY,
        //     'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        // },
        data: JSON.stringify(dataRequest),

        success: function (response) {
            console.log("Token:", response.token);
            getCompilerResult(response.token, 0);
        },

        error: function (error) {
            console.log('lỗi: ', error); 
        }
    });
}

function getCompilerResult(token, index) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `http://binhan.serveftp.com:2358/submissions/${token}?base64_encoded=false&fields=*`,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'X-RapidAPI-Key': MY_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },

            success: function (response) {
                if (response.status && (response.status.id == 1 || response.status.id == 2)) {
                    console.log(`Status: ${response.status.description}. Retrying...`);
                    setTimeout(() => resolve(getCompilerResult(token, index)), 2000);
                } else {
                    excuting.style.display = 'none';
                    console.log("Execution Result:", response);
                    SubmitSession(response);
                    renderResultsToTable(response, index);
                    resolve(response);
                }
            },

            error: function (error) {
                console.log('Lỗi: ', error);
                excuting.innerText = error;
                reject(error);
            }
        });
    });
}

async function SubmitSession(response) {
    let isSuccess = false;
    let score = 0;
    console.log(response);
    
    if (response.status && response.status.id == 3){
        isSuccess = true;
        score = 1;
    }else{
        isSuccess = false;
        score = 0;
    }


    const dataRequest = {
        language: assessmentItem.language ? assessmentItem.language :null,
        totalScore: score,
        sourceCode: editor.getValue().trim(),
        isSuccess:  isSuccess,
        submittedAt: new Date(),
        assessmentsId: assignmentID
    }

    $.ajax({
        url: `${API_URL}submits`,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'authorization': `Bearer ${getToken()}`
        },
        data: JSON.stringify(dataRequest),
        success: function() {
            console.log('done');
        },
        error: function(error) {
            console.log('Lỗi:', error);
        }
    });

}

async function getSubmitResult(response, index) {

    if (index >= response.length) {
        return;
    }

    try {
        const mytoken = response[index].token;
        await getCompilerResult(mytoken, index);
        getSubmitResult(response, index + 1);
    } catch (err) {
        console.error('Lỗi: ', err);
    }

}

function renderResultsToTable(submission, count){
    const newContainer = document.createElement('div');
                        newContainer.classList.add('col-xxl-10', 'offset-xxl-1', 'col-xl-10', 'offset-xl-1', 'col-lg-10', 'offset-lg-1');
                        if (submission.status && submission.status.id === 3) {
                            //Accepted
                            // var stdin = decode(submission.stdin);
                            // var stdout = decode(submission.stdout);
                            // var expected_output = decode(submission.expected_output);


                            count = count + 1;
                            let isSampleTestCase;
                            if (count <= testCasesItem.length) {
                                isSampleTestCase = true;
                            } else isSampleTestCase = false;

                            newContainer.innerHTML = `
        <div class="events__item mb-10 hover__active">
              <div class="events__item-inner d-sm-flex align-items-center justify-content-between white-bg">
                  <div class="events__content">
                        <div class="events__meta">
                            <span>${submission.time}s</span>
                            <span>${submission.memory}KB</span>
                            <span>Success</span>
                        </div>
                        <h3 class="events__title">
                            <a class="price__features">
                                <i class="far fa-check" style="background: rgb(48 168 32 / 9%);
                                    border-radius: 50%;
                                    font-size: 25px;"></i> Sample Test case 0${count}
                            </a>
                        </h3>
                  </div>
                 <div class="events__more">
                    ${isSampleTestCase ? `<a class="link-btn" id="view-more-button-${count}" style="cursor: pointer">
                                Xem chi tiết
                                <i class="far fa-arrow-right"></i>
                                <i class="far fa-arrow-right"></i>
                              </a>` : `<a class="link-btn" id="view-more-button-${count}" style="cursor: pointer">
                                          Hidden TestCase
                                          <i style="color: #69b35c;" class="far fa-unlock"></i>
                                          <i style="color: #e65972;" class="far fa-lock"></i>
                                       </a>`}
                 </div>
             </div>
        </div>
        <div id="event-details-${count}" style="display: none; padding: 10px 60px 60px 60px; border-radius: 7px; background-color: white">
            <div class="contact__info white-bg p-relative z-index-1">
                <div class="contact__info-inner white-bg">
                    <ul>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Trạng Thái</h4>
                                    <pre class="pre-tags" style="font-weight: initial; text-align: center">Thành công</pre>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Input</h4>
                                     <pre class="pre-tags line-numbers language-markup">
                                       <code class="language-markup">
                                         ${submission.stdin}
                                       </code>
                                    </pre>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Output</h4>
                                     <pre class="pre-tags line-numbers language-markup">
                                       <code class="language-markup">
                                         ${submission.stdout}
                                       </code>
                                    </pre>
                                </div>
                            </div>
                        </li>
                     
                    </ul>
                </div>
            </div>
        </div>
 
    `;
                            // Thêm container vào container chứa test cases
                            testCasesContainer.appendChild(newContainer);

                            const viewMoreButton = document.getElementById(`view-more-button-${count}`);
                            const testcaseDetails = document.getElementById(`event-details-${count}`);
                            viewMoreButton.addEventListener('click', () => {
                                if (testcaseDetails.style.display === 'block') {
                                    testcaseDetails.style.display = 'none';
                                } else {
                                    testcaseDetails.style.display = 'block';
                                }
                            });
                            excuting.style.display = 'none';
                            Prism.highlightAll();
                            resultSection.style.display = 'block';

                        } else if (submission.status && submission.status.id === 4) {
                            //Wrong Answer
                            // var stdin = decode(submission.stdin).trim();
                            // var stdout = decode(submission.stdout).trim();
                            // var expected_output = decode(submission.expected_output).trim();

                            count = count + 1;
                            newContainer.innerHTML = `
        <div class="events__item mb-10 hover__active">
              <div class="events__item-inner d-sm-flex align-items-center justify-content-between white-bg">
            <div class="events__content">
                <div class="events__meta">
                   <span>${submission.time}s</span>
                                                   <span>${submission.memory} KB</span>
                                                   <span>Sai kết quả</span>
                </div>
                <h3 class="events__title" style="color: #d12a47;">
                    <a class="price__features">
                        <i class="far fa-warning" style="background: rgb(48 168 32 / 9%);
                            border-radius: 50%;
                            font-size: 25px;"></i>  Sample Test case 0${count}
                    </a>
                </h3>
            </div>
            <div class="events__more">
                <a class="link-btn" id="view-more-button-${count}" style="color: #e65972; cursor: pointer">
                    Xem chi tiết
                    <i class="far fa-arrow-right"></i>
                    <i class="far fa-arrow-right"></i>
                </a>
            </div>
            </div>
        </div>
        <div id="event-details-${count}" style="display: none; padding: 10px 60px 60px 60px; border-radius: 7px; background-color: white">
            <div class="contact__info white-bg p-relative z-index-1">
                <div class="contact__info-inner white-bg">
                    <ul>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Trạng Thái</h4>
                                    <pre class="pre-tags" style="font-weight: initial;text-align: center">Kết quả không trùng khớp</pre>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Input</h4>
                                  
                                   <pre class="pre-tags line-numbers language-markup">
                                      <code class="language-markup"> 
                                        ${submission.stdin}
                                       </code>
                                     
                                    </pre>
                                
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Your Output</h4>
                                    <pre class="pre-tags line-numbers language-markup">
                                       <code class="language-markup">
                                         ${submission.stdout}
                                       </code>
                                    </pre>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Expected Output</h4>
                               
                                     <pre class="pre-tags line-numbers language-markup">
                                       <code class="language-markup">
                                         ${submission.expected_output}
                                       </code>
                                    </pre>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
 
    `;
                            // Thêm container vào container chứa test cases
                            testCasesContainer.appendChild(newContainer);
                            Prism.highlightAll();
                            const viewMoreButton = document.getElementById(`view-more-button-${count}`);
                            const testcaseDetails = document.getElementById(`event-details-${count}`);
                            viewMoreButton.addEventListener('click', () => {
                                if (testcaseDetails.style.display === 'block') {
                                    testcaseDetails.style.display = 'none';
                                } else {
                                    testcaseDetails.style.display = 'block';
                                }
                            });
                            excuting.style.display = 'none';
                            resultSection.style.display = 'block';
                            return false;
                        } else if (submission.status && submission.status.id === 11) {
                            var message = submission.message;
                            var description = (submission.status.description);
                            var output = [message, description].join("\n").trim();

                            count = count + 1;
                            newContainer.innerHTML = `
        <div class="events__item mb-10 hover__active">
              <div class="events__item-inner d-sm-flex align-items-center justify-content-between white-bg">
            <div class="events__content">
                <div class="events__meta">
                   <span>${submission.time}s</span>
                                                   <span>${submission.memory} KB</span>
                                                   <span>Error Status 11</span>
                </div>
                <h3 class="events__title">
                    <a class="price__features" style="color: #d12a47;">
                        <i class="far fa-warning" style="background: rgb(48 168 32 / 9%);
                            border-radius: 50%;
                            font-size: 25px;"></i>Test case 0${count}
                    </a>
                </h3>
            </div>
            <div class="events__more">
                <a class="link-btn" id="view-more-button-${count}" style="color: #e65972; cursor: pointer">
                    Xem chi tiết
                    <i class="far fa-arrow-right"></i>
                    <i class="far fa-arrow-right"></i>
                </a>
            </div>
            </div>
        </div>
        <div id="event-details-${count}" style="display: none; padding: 10px 60px 60px 60px; border-radius: 7px; background-color: white">
            <div class="contact__info white-bg p-relative z-index-1">
                <div class="contact__info-inner white-bg">
                    <ul>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Trạng Thái</h4>
                                     <pre style="font-weight: initial class="pre-tags line-numbers language-markup">
                                       <code class="language-markup">
                                         ${output}
                                       </code>
                                    </pre>
                                </div>
                            </div>
                        </li>
                   
                    </ul>
                </div>
            </div>
        </div>
 
    `;
                            // Thêm container vào container chứa test cases
                            testCasesContainer.appendChild(newContainer);
                            Prism.highlightAll();
                            const viewMoreButton = document.getElementById(`view-more-button-${count}`);
                            const testcaseDetails = document.getElementById(`event-details-${count}`);
                            viewMoreButton.addEventListener('click', () => {
                                if (testcaseDetails.style.display === 'block') {
                                    testcaseDetails.style.display = 'none';
                                } else {
                                    testcaseDetails.style.display = 'block';
                                }
                            });
                            excuting.style.display = 'none';
                            resultSection.style.display = 'block';
                            return false;
                        } else {

                            var stdout = submission.status.description;
                            var compile_output = submission.compile_output;
                            var output = [stdout, compile_output].join("\n\n").trim();
                            console.log("status ID: " + submission.status.id);
                            count = count + 1;
                            // console.log(stdout, compile_output, compile_output);
                            
                            newContainer.innerHTML = `
        <div class="events__item mb-10 hover__active">
              <div class="events__item-inner d-sm-flex align-items-center justify-content-between white-bg">
            <div class="events__content">
                <div class="events__meta">
                   <span>${submission.time}s</span>
                                                   <span>${submission.memory} KB</span>
                                                  <span>Error Status ${submission.status.id}</span>
                </div>
                <h3 class="events__title">
                    <a class="price__features" style="color: #d12a47;">
                        <i class="far fa-warning" style="background: rgb(48 168 32 / 9%);
                            border-radius: 50%;
                            font-size: 25px;"></i>  Sample Test case 0${count}
                    </a>
                </h3>
            </div>
            <div class="events__more">
                <a class="link-btn" id="view-more-button-${count}" style="color: #e65972; cursor: pointer">
                    Xem chi tiết
                    <i class="far fa-arrow-right"></i>
                    <i class="far fa-arrow-right"></i>
                </a>
            </div>
            </div>
        </div>
        <div id="event-details-${count}" style="display: none; padding: 10px 60px 60px 60px; border-radius: 7px; background-color: white">
            <div class="contact__info white-bg p-relative z-index-1">
                <div class="contact__info-inner white-bg">
                    <ul>
                        <li>
                            <div class="contact__info-item d-flex align-items-start mb-20">
                                <div class="contact__info-text" style="width: 100%">
                                    <h4 class="blue-grey">Trạng Thái</h4>
                              
                                  <pre class="pre-tags line-numbers language-markup">
                                       <code class="language-markup">
                                         ${output}
                                       </code>
                                    </pre>
                                </div>
                            </div>
                        </li>
                   
                    </ul>
                </div>
            </div>
        </div>
 
    `;
                            // Thêm container vào container chứa test cases
                            testCasesContainer.appendChild(newContainer);
                            Prism.highlightAll();

                            const viewMoreButton = document.getElementById(`view-more-button-${count}`);
                            const testcaseDetails = document.getElementById(`event-details-${count}`);
                            viewMoreButton.addEventListener('click', () => {
                                if (testcaseDetails.style.display === 'block') {
                                    testcaseDetails.style.display = 'none';
                                } else {
                                    testcaseDetails.style.display = 'block';
                                }
                            });
                            excuting.style.display = 'none';
                            resultSection.style.display = 'block';
                            return false;
                        }
}

function checkEmty(){
    const data = editor.getValue().trim();
    if (data == '' || assessmentItem == null || testCasesItem.length < 1) {
        toastr.info("Vui lòng viết mã của bạn trước khi Submit", "Cảnh báo", {
            closeButton: true,
            progressBar: true
        })
        return false;
    }
    return true;
}

theme.addEventListener("change", function () {
    if (theme.value === "Dark") {
        editor.setOption("theme", "dracula")

    }
    if (theme.value === "Light") {
        editor.setOption("theme", "3024-day")
    }
    if (theme.value === "Night") {
        editor.setOption("theme", "night")
    }
    if (theme.value === "Idea") {
        editor.setOption("theme", "idea")
    }
    if (theme.value === "Ocenaic") {
        editor.setOption("theme", "oceanic-next")
    }
})

$('#inlineFormSelectPref').on("change", function(){
    initEditer($(this).val())
});

run.addEventListener("click", async function () {
    if (!checkEmty()) {
        return;
    }
    testCasesContainer.innerHTML = '';
    excuting.style.display = 'block';
    const bottomElement = document.getElementById('excuting');
    bottomElement.scrollIntoView({behavior: 'smooth'});
    var testcase = testCasesItem.find(item => item.markSampleTestCase === true );
    console.log(testcase);

    if (testcase) {
        compile_code(testcase);
    }else{
        compile_code(null);
    }
    
})

submit.addEventListener("click", async function () {
    if (!checkEmty()) {
        return;
    }
    testCasesContainer.innerHTML = '';
    excuting.style.display = 'block';
    const bottomElement = document.getElementById('excuting');
    bottomElement.scrollIntoView({behavior: 'smooth'});

    let submissionList = [];
    testCasesItem.forEach( (item) => {
        const submitItem = {
            language_id: option,
            source_code: editor.getValue().trim(),
            stdin: item.input || '',
            expected_output: item.expectedOutput || '',
            cpu_time_limit: 2,
            memory_limit: assessmentItem.memoryLimit > 0 ? assessmentItem.memoryLimit : null
        };

        submissionList.push(submitItem);
    });

    const dataRequest = {
        "submissions": submissionList
    };
   

    if (submissionList && submissionList.length > 0) {
        $.ajax({
            url: 'http://binhan.serveftp.com:2358/submissions/batch',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataRequest),
            success: function(response) {
                console.log('response');
                console.log(response);
                getSubmitResult(response,0);
            },
            error: function(error) {
                console.log('Lỗi:', error);
            }
        });
    } else {
        console.log("Lỗi: submissionList không có dữ liệu.");
    }

    

})

CodeMirror.registerHelper("hint", "java", function (editor) {
    const cur = editor.getCursor(); // Vị trí hiện tại của con trỏ
    const token = editor.getTokenAt(cur); // Token hiện tại

    const start = token.start;
    const end = token.end;
    const word = token.string; // Từ đang được nhập

// Danh sách các gợi ý mã cho Java
const suggestions = [
    // Các từ khóa cơ bản
    "public",
    "private",
    "protected",
    "default",
    "static",
    "final",
    "abstract",
    "synchronized",
    "volatile",
    "transient",
    "native",
    "strictfp",
    "enum",
    "package",
    "import",
    "extends",
    "implements",
    "super",
    "this",
    "interface",
    "new",
    "instanceof",
    "throw",
    "throws",
    "try",
    "catch",
    "finally",
    "return",
    "break",
    "continue",
    "goto", // Mặc dù 'goto' không được sử dụng, nhưng là một từ khóa dự phòng trong Java

    // Các kiểu dữ liệu cơ bản
    "int",
    "long",
    "float",
    "double",
    "char",
    "boolean",
    "byte",
    "short",
    "String",
    "void",

    // Các lớp trong thư viện chuẩn
    "System.out.println",
    "System.out.print",
    "Math",
    "StringBuilder",
    "StringBuffer",
    "ArrayList",
    "HashMap",
    "HashSet",
    "LinkedList",
    "Arrays",
    "Collections",
    "File",
    "Scanner",
    "Object",
    "Thread",
    "Runnable",
    "Exception",
    "IOException",
    "NullPointerException",
    "ClassNotFoundException",
    "IllegalArgumentException",
    "ArithmeticException",

    // Cấu trúc điều khiển
    "if",
    "else",
    "switch",
    "case",
    "for",
    "while",
    "do",
    "try",
    "catch",
    "finally",
    "continue",
    "break",
    "return",

    // Các phương thức phổ biến
    "equals",
    "hashCode",
    "toString",
    "clone",
    "getClass",
    "notify",
    "notifyAll",
    "wait",

    // Các từ khóa liên quan đến đối tượng và lớp
    "super",
    "this",
    "instanceof",
    "new",
    "final",
    "abstract",
    "extends",
    "implements",
    "constructor",

    // Các từ khóa và phương thức liên quan đến Exception
    "throw",
    "throws",
    "Exception",
    "RuntimeException",
    "IOException",
    "FileNotFoundException",
    "NullPointerException",
    
    // Các từ khóa liên quan đến multi-threading
    "Thread",
    "Runnable",
    "synchronized",
    "volatile",
    "sleep",
    "wait",
    "notify",
    "notifyAll"
];

    // Lọc gợi ý theo từ khóa hiện tại
    const filteredSuggestions = suggestions.filter(s => s.startsWith(word));

    return {
        list: filteredSuggestions,
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end)
    };
});

// Tự động gợi ý khi gõ
editor.on("inputRead", function (cm, change) {
    if (change.text[0].match(/[a-zA-Z.]/)) {
        cm.showHint({
            hint: CodeMirror.hint.java,
            completeSingle: false // Không tự động thay thế khi có một gợi ý
        });
    }
});

