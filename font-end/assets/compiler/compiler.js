import {MY_CHATGPT_API_KEY} from "./config.js"
import {MY_API_KEY} from "./config.js";
var run = document.getElementById("run");
var theme = document.getElementById("theme");
let option;
const excuting = document.getElementById('excuting');

$(document).ready(function () {
    initEditer("1");
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
});

$('#inlineFormSelectPref').on("change", function(){
    initEditer($(this).val())
});

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

//batch submission
run.addEventListener("click", async function () {
    excuting.style.display = 'block';
    const bottomElement = document.getElementById('excuting');
    bottomElement.scrollIntoView({behavior: 'smooth'});
    $('#resultTable').css('display', 'none');
    compile_code(null)
});

function compile_code(testCase){
    if (testCase) {
        
    }else{
        $.ajax({
            // url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*',
            url: 'http://binhan.serveftp.com:2358/submissions?base64_encoded=false&fields=*',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-RapidAPI-Key': MY_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: JSON.stringify({
                language_id: option,
                source_code: editor.getValue().trim(),
                stdin: $('#input').val().trim() || '',
                expected_output: null,
                cpu_time_limit: '',
                memory_limit: ''
            }),

            success: function (response) {
                console.log("Token:", response.token);
                getCompilerResult(response.token);
            },

            error: function (error) {
                console.log('lỗi: ', error); 
            }
        });
    }
}

function getCompilerResult(token) {
    $.ajax({
        url: `http://binhan.serveftp.com:2358/submissions/${token}?base64_encoded=false&fields=*`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'X-RapidAPI-Key': MY_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },

        success: function (response) {
            if (response.status && response.status.id == 1 || response.status.id == 2) { 
                console.log(`Status: ${response.status.description}. Retrying...`);
                setTimeout(() => getCompilerResult(token), 2000);
            } else {
                excuting.style.display = 'none';
                $('#resultTable').css('display', 'table');
                console.log("Execution Result:", response);


                renderResultsToTable([response], response.status.id, null);
                console.log("Output:", response.stdout);

                // if (response.stdout) {
                //     renderResultsToTable([response], response.status.id, null);
                //     console.log("Output:", response.stdout);
                // } else if (response.stderr) {
                //     excuting.innerText = `Lỗi: ${response.stderr}` ;
                //     console.log("Error Output:", response.stderr);
                // } else {
                //     excuting.innerText = "No output available." ;
                //     console.log("No output available.");
                // }
            }
        },

        error: function (error) {
            console.log('Lỗi: ', error); 
            excuting.innerText = error;
        }
    });
}

function renderResultsToTable(results, resultId, testCase) {
    const tableBody = document.querySelector('#resultTable tbody');
    tableBody.innerHTML = '';

    results.forEach((submission, index) => {
        const row = document.createElement('tr');

        results.forEach((submission, index) => {
            const row = document.createElement('tr');
        
            const stt = index + 1;
            const expected_output = (testCase && testCase[index]) ? testCase[index] : '';
            const output = submission.stdout || '';
            const time = submission.time || 'N/A';
            const memory = submission.memory || 'N/A';
            const result = (submission.status.id == 3) ? "✅ thành công" : `❌ ${submission.status.description}`;
        
            // Kiểm tra nếu resultId khác 3 thì gộp 5 ô cuối thành 1 và tô đỏ nền
            if (submission.status.id !== 3) {
                row.innerHTML = `
                    <td style="background-color: red; color: white; text-align: center; border-with: 1px; border-color: #000">
                        ${stt}
                    </td>
                    <td colspan="5" style="background-color: red; color: white; text-align: center; border-with: 1px; border-color: #000">
                        <button class="detail-btn" data-error="${index+1}" style="background-color: red; color: white; text-align: center;">${result}</button>
                    </td>
                `;
                tableBody.appendChild(row);
                const button = row.querySelector('.detail-btn');
                button.addEventListener('click', () => {
                    showPopup(submission.compile_output);
                 });
            } else {
                row.innerHTML = `
                    <td>${stt}</td>
                    <td>${output}</td>
                    <td>${expected_output}</td>
                    <td>${time}</td>
                    <td>${memory}</td>
                    <td>${result}</td>
                `;
                tableBody.appendChild(row);
            }
        });
        
    });
}

function showPopup(detail) {
    const formattedDetail = detail.replace(/\n/g, '<br>');
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.border = '0px solid black';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    popup.style.minWidth = '300px'; 
    popup.style.width = '70vw';
    popup.style.maxHeight = '65vh';
    popup.style.overflowY = 'auto';
    popup.style.zIndex = '9999'; 

    popup.innerHTML = `
        <h3>Chi tiết lỗi</h3>
        <pre style="white-space: pre-wrap; font-family: inherit; margin-left: 35px; font-size: 18px; max-height: 50vh">${formattedDetail}

        </pre>
        <div style="text-align: right; margin-top: 10px;">
            <button id="close-popup" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 3px;">Đóng</button>
        </div>
    `;

    document.body.appendChild(popup);

    // Đóng popup khi nhấn nút "Đóng"
    document.getElementById('close-popup').addEventListener('click', function () {
        document.body.removeChild(popup);
    });
}

