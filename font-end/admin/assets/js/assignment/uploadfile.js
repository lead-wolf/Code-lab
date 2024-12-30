import * as assignmentSv from "/admin/assets/js/assignment/assignment_add.js"
import * as lcServices  from "/assets/services/localStorageService.js"
import { API_URL } from "/assets/js/configuration.js"

const addedFiles = new Set();

function handleFiles(files) {
    let isShow = false;
    const fileMap = new Map();
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileBaseName = fileName.split('.')[0];
        const fileExtension = fileName.split('.').pop();

        if (addedFiles.has(fileBaseName)) {
            console.log(`File ${file.name} đã được thêm!`);
            toastr.info(`File ${file.name} đã được thêm vào bảng.`, 'Thông báo', {
                closeButton: true,
                progressBar: true,
                timeout: 5000
            });
            continue;
        }

        // Phân loại file vào map
        if (fileExtension === 'inp') {
            if (!fileMap.has(fileBaseName)) {
                fileMap.set(fileBaseName, { inp: null, out: null });
            }
            fileMap.get(fileBaseName).inp = file;
        } else if (fileExtension === 'out') {
            if (!fileMap.has(fileBaseName)) {
                fileMap.set(fileBaseName, { inp: null, out: null });
            }
            fileMap.get(fileBaseName).out = file;
        }
    }

    // Xử lý dữ liệu từ file map
    fileMap.forEach((files, baseName) => {
        if (files.inp && files.out) {
            Promise.all([readFile(files.inp), readFile(files.out)]).then(([inputContent, outputContent]) => {
                appendToTable('#testCaseInputTable', files.inp.name, inputContent, baseName);
                appendToTable('#testCaseOutPutTable', files.out.name, outputContent, baseName);
                addedFiles.add({
                    baseName,
                    inp: {name: files.inp.name, content: inputContent },
                    out: {name: files.out.name, content: outputContent }
                });
            });
            isShow = true;
        } else {
            const missingType = files.inp ? '.OUT' : '.INP';
            toastr.error(`Thiếu file ${baseName}${missingType} tương ứng!`, 'Lỗi', {
                closeButton: true,
                progressBar: true,
                timeout: 5000
            });
        }
    });
            
    if (isShow) {
        $('#form-btn').css('display', 'block');
    }else{
        $('#form-btn').css('display', 'none');
    }
}

// đọc nội dung file
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

// thêm dữ liệu vào bảng
export function appendToTable(tableSelector, fileName, content, baseName) {
    const row = `
        <tr data-base-name="${baseName}">
            <td>${fileName}</td>
            <td>${content}</td>
            <td><button class="btn-edit">🗑️</button></td>
        </tr>
    `;
    $(tableSelector).append(row);
}

export function getTestCases(){
    const testCases = [];
    const scoreTestCase = $('#testcase-score').val() ? Number($('#testcase-score').val()/addedFiles.size) : 1 ;        
    addedFiles.forEach( (item) => {
        const testcase = {
            name: item.baseName,
            input: item.inp.content,
            expectedOutput: item.out.content,
            score: scoreTestCase,
            markSampleTestCase: false
        };
        testCases.push(testcase);
        // console.log(testcase);
    });
    testCases[0].markSampleTestCase = true;
    // console.log(testCases);
    
    return testCases;
}

$(function () {

    $('.upload-text').on('click', function () {
        $(this).siblings('input[type="file"]').click();
    });    

    $('input[type="file"]').on('change', function () {
        const files = this.files; // Lấy danh sách file được chọn
        handleFiles(files);
    });

    $('.upload-container').on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragover');
    }).on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    }).on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    
        // Lấy file từ sự kiện kéo thả
        const files = e.originalEvent.dataTransfer.files;
        handleFiles(files);
    });
    
    $('#remove-all-file').click(function() {
        $('#testCaseInputTable').empty();
        $('#testCaseOutPutTable').empty();
        $('#form-btn').css('display', 'none');
        addedFiles.clear();
    });

    $('input[name=save]').click(function() {
       if (addedFiles.size > 0) {
            const dataRequest = {
                assignmentRequest: assignmentSv.getProblemDetails(),
                testCaseRequest: getTestCases()
            };
            console.log(dataRequest);

            if (dataRequest.assignmentRequest && dataRequest.testCaseRequest) {
                console.log('feth data');
                
                $.ajax({
                    url: `${API_URL}assignments`,
                    type: 'POST',
                    contentType: 'application/json',
                    headers: {
                       'Authorization': `Bearer ${lcServices.getToken()}` 
                    },
                    data: JSON.stringify(dataRequest),

                    success: function(){
                        toastr.success('Thêm bài tập thành công!', 'Thành công', {
                            closeButton: true,
                            progressBar: true,
                            // timneOut: 2000,
                            onHidden: function () {
                                window.location.href = '/admin/assignment'
                            }
                        });
                    },
                    error: function(error){
                        toastr.error('Có lỗi xảy ra vui lòng thử lại!', 'Lỗi', {
                            closeButton: true,
                            progressBar: true,
                            timneOut: 5000
                        });
                        console.log('ERROR: ',error.responseJSON?.message);
                    }
                });
            }
         
       }else{
        toastr.error('Vui lòng thêm testcase!', 'Lỗi' ,{
            closeButton: true,
            progressBar: true,
            timeout: 5000
        })
       }
        
    });

    $(document).on('click', '.btn-edit', function (event) {
        event.preventDefault();
        const $row = $(this).closest('tr');
        const baseName = $row.data('base-name');

        $(`#testCaseInputTable tr[data-base-name="${baseName}"]`).remove();
        $(`#testCaseOutPutTable tr[data-base-name="${baseName}"]`).remove();
    });
});
