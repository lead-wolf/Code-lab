import  * as lcServices  from "/assets/services/localStorageService.js"
import * as assignmentSv from "/admin/assets/js/assignment/assignment_add.js"
import * as upfileSv from "/admin/assets/js/assignment/uploadfile.js"
import { API_URL } from "/assets/js/configuration.js"

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
let testCaseDelete = [];

function fillData() {
    const assignments = JSON.parse(localStorage.getItem("assignments"));
    const item = assignments.find(obj => obj.id == id);

    if (assignments.length > 0) {
        $('#form-btn').css('display', 'block');
    }else{
        $('#form-btn').css('display', 'none');
    }

    if (!item) {
        console.error(`Không tìm thấy assignment với id: ${id}`);
        alert("có lỗi xảy ra");
        window.location.href = "./";
        return;
    }

    const levelMap = {
        Easy: "1",
        Medium: "2",
        Hard: "3"
    };
    const levelValue = levelMap[item.level] || "";
    $('input[name="isCertificateQuestion"]').prop("checked", item.isCertificateQuestion || false);
    $('input[name="title"]').val(item.title || "");
    $('input[name="timeLimit"]').val(item.timeLimit || "");
    $('input[name="memoryLimit"]').val(item.memoryLimit || "");
    $('select[name="level"]').val(levelValue);
    $("#summernote").summernote("code", item.description || "");

    fillTestCases();
}

function fillTestCases(){
    $.ajax({
        url: `${API_URL}testcase/all/${id}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${lcServices.getToken()}`,
        },
        success: function(response){
            if (response.code == 1000) {
                const data = response.result;
                localStorage.setItem("testcase", JSON.stringify(data));
                const fieldTemplate = $('#field0').clone();
                $('#field').empty();

                if (data.length == 0) {
                    $('#field').append(fieldTemplate);
                }

                // Fill từng testcase vào các trường
                data.forEach((testCase, index) => {
                    // Tạo một trường mới hoặc clone mẫu trường
                    const newField = fieldTemplate.clone();
                    let newBtnRm = $('#add-more').clone();
                    newBtnRm.attr('id', `remove${index+1}`)
                            .text('Xoá')
                            .css('background-color', '#f1536e');

                    upfileSv.appendToTable('#testCaseInputTable', testCase.name, testCase.input, testCase.name);
                    upfileSv.appendToTable('#testCaseOutPutTable', testCase.name, testCase.expectedOutput, testCase.name);
                        
                    // Update ID và giá trị
                    newField.attr('id', `field${index}`);
                    newField.find(`#TSName0`).attr('id', `TSName${index}`).val(testCase.name || '');
                    newField.find(`#TSScore0`).attr('id', `TSScore${index}`).val(testCase.score || '');
                    newField.find(`#TSInput0`).attr('id', `TSInput${index}`).val(testCase.input || '');
                    newField.find(`#TSOutput0`).attr('id', `TSOutput${index}`).val(testCase.expectedOutput || '');

                    newField.find('p').each(function() {
                        const currentId = $(this).attr('id');
                        if (currentId) {
                            const updatedId = currentId.replace('0', index);
                            $(this).attr('id', updatedId);
                        }
                    });
                    // Xử lý checkbox
                    newField.find(`#TSSample0`).attr('id', `TSSample${index}`).prop('checked', testCase.markSampleTestCase || false);

                    // Append field mới vào container
                    $('#field').append(newField);
                    $('#field').append(newBtnRm);
                });

                const btnDelete = $(`#remove${$('.testcase-item').length}`);
                if (btnDelete) {
                    btnDelete.remove();
                }
            }else{
                toastr.error('Lỗi không thể load TestCase!', 'Lỗi', {
                    closeButton: true,
                    progressBar: true
                });
            }
        },
        error: function(error){
            console.log('lỗi: ', error);
            toastr.error('Lỗi không thể load TestCase!', 'Lỗi', {
                closeButton: true,
                progressBar: true
            });
        }
    });
}

function addMoreTestCase(){
    let newField = $('#field0').clone();
    let newBtnRm = $('#add-more').clone();
    
    newBtnRm.attr('id', `remove${$('.testcase-item').length + 1}`)
            .text('Xoá')
            .css('background-color', '#f1536e');
    
    // Cập nhật ID và name cho các trường
    assignmentSv.updateTestcaseFields(newField, $('.testcase-item').length + 1);
    $('#field').append(newBtnRm);
    $('#field').append(newField);
}

function deleteTestCase(id){
    const testCase = JSON.parse(localStorage.getItem('testcase'));
    if (id > testCase.length) {
        $(`#field${id}`).remove();
        $(`#remove${id}`).remove();
    }else{
        if (testCase) {
            testCaseDelete.push(testCase[id].id);
            $(`#field${id}`).remove();
            $(`#remove${id}`).remove();
        }else{
            console.log('id không hợp lệ');
            
        }
    }
}

function getListTestCase(){
    let testCases = [];
    let isValid = true;
    $('.testcase-item').each(function() {
        console.log('run');
        
        const testcaseIndex = $(this).attr('id').replace('field', '');
        // const name = $(`#TSName${testcaseIndex}`).val().trim();
        // const score = $(`#TSScore${testcaseIndex}`).val().trim();
        // const input = $(`#TSInput${testcaseIndex}`).val().trim();
        // const output = $(`#TSOutput${testcaseIndex}`).val().trim();

        // // Xử lý tên testcase
        // if (!name) {
        //     $(`#name-error${testcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#name-error${testcaseIndex}`).hide();
        // }

        // // Xử lý điểm
        // if (!score || isNaN(score) || Number(score) <= 0) {
        //     $(`#score-error${testcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#score-error${testcaseIndex}`).hide();
        // }

        // // Xử lý đầu vào
        // if (!input) {
        //     $(`#input-error${testcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#input-error${testcaseIndex}`).hide();
        // }

        // // Xử lý kết quả mong đợi
        // if (!output) {
        //     $(`#output-error${testcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#output-error${testcaseIndex}`).hide();
        // }

        isValid = true;

        if (isValid) {
            let item = JSON.parse(localStorage.getItem('testcase'))[testcaseIndex];
            if (item) {
                item = {
                    id: item.id,
                    name: $(`#TSName${testcaseIndex}`).val().trim(),
                    input: $(`#TSInput${testcaseIndex}`).val().trim(),
                    expectedOutput: $(`#TSOutput${testcaseIndex}`).val().trim(),
                    score: $(`#TSScore${testcaseIndex}`).val().trim(),
                    markSampleTestCase: $(this).find('input[type="checkbox"]').is(':checked')
                }
                testCases.push(item);
            }else{
                const testCase = {
                    id: '',
                    name: $(`#TSName${testcaseIndex}`).val().trim(),
                    input: $(`#TSInput${testcaseIndex}`).val().trim(),
                    expectedOutput: $(`#TSOutput${testcaseIndex}`).val().trim(),
                    score: $(`#TSScore${testcaseIndex}`).val().trim(),
                    markSampleTestCase: $(this).find('input[type="checkbox"]').is(':checked')
                };
                testCases.push(testCase);
            }
        }
    });
    if (!isValid) {
        return;
    }
    return testCases;
}

function updateAssignment() {
    const requestData = {
        assignmentRequest: assignmentSv.getProblemDetails(),
        testCaseRequest: getListTestCase()
    }

    console.log(requestData);
    

    if (requestData.assignmentRequest && requestData.testCaseRequest) {
        console.log('feth');
        $.ajax({
            url: `${API_URL}assignments/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${lcServices.getToken()}`, 
            },
            data: JSON.stringify(requestData),

            success: function (response) {
                if (response.code == 1000) {
                    //fetchDeleteTestcase();
                    toastr.success('Cập nhật bài tập thành công', 'Thành công',{
                        closeButton: true,
                        progressBar: true,
                        setTimeout: 2000,
                        onHidden: () => { window.location.href = "/admin/assignment"}
                    });
                }
                
            },
            error: function (error) {
                console.log('lỗi: ', error.responseJSON?.message);
                toastr.error('Lỗi khi cập nhật bài tập', 'lỗi',{
                    closeButton: true,
                    progressBar: true
                });
            }
        });
        console.log('run');
        
    }
}

function saveTestCase() {
    updateAssignment();
}

function getTestCasesFromTable() {
    let testCases = [];
    const scoreTestCase = $('#testcase-score').val() ? Number($('#testcase-score').val()/addedFiles.size) : 1 ;  

    $('#testCaseInputTable tr').each( function() {
        var baseName = $(this).data('base-name');        

        var rowInput = $(this).find('td').map( function() {
            return $(this).text();
        }).get();

        var tableOut = $(`#testCaseOutPutTable tr[data-base-name="${baseName}"]`);        

        if (tableOut.length > 0) {
            var rowOutput = tableOut.find('td').map( function() {
                return $(this).text();
            }).get();           

            var testCase = {
                name: baseName,
                input: rowInput[1],
                expectedOutput: rowOutput[1],
                score: scoreTestCase,
                markSampleTestCase: false
            };

            testCases.push(testCase);
            console.log(testCase);
            
            testCases[0].markSampleTestCase = true;
        }else{
            toastr.error(`Lỗi khi load testcase ${baseName}`, "lỗi", {
                progressBar: true,
                closeButton: true,
                setTimeout: 3000
            });
        }
    });

    console.log('get testcase end.');
    console.log(testCases);
    return testCases;
}

$(function() {
    fillData();

    //block test delete before   final;
    // {
    //     $('#up-file').fadeIn();
    //     $('#testcase').hide();
    //     $('#problem-details').hide();
    // }

    // $('#step-one').off('click').click(assignmentSv.stepOne);
    // $('#goback').off('click').click(assignmentSv.goBack);
    $('#add-more').off('click').click(addMoreTestCase);

    $('#remove-all-testcase').click(function() {
        
        $('.testcase-item').each(function () {
            const testcaseIndex = $(this).attr('id').replace('field', '');
            const testCase = JSON.parse(localStorage.getItem('testcase'))[testcaseIndex].id;
            testCaseDelete.push(testCase);
            if (testcaseIndex == 0) {
                $(`#TSName${testcaseIndex}`).val('');
                $(`#TSScore${testcaseIndex}`).val('');
                $(`#TSInput${testcaseIndex}`).val('');
                $(`#TSOutput${testcaseIndex}`).val('');
            }else{
                const obj = $(`#remove${testcaseIndex}`);
                if (obj.length > 0) {
                    assignmentSv.removeTestCase(obj);
                } else {
                    console.warn(`Không tìm thấy nút xóa cho testcase index: ${testcaseIndex}`);
                }
            }
        });
    });

    $('.btn-cancel').on('click', function() {
        window.location.href = "./";
    });

    $('#save-testcase').off('click').click(saveTestCase);

    $('#field').off('click').on('click', '[id^="remove"]', function() {
        const idDelette = $(this).attr('id').replace('remove', '');
        console.log(idDelette);
        deleteTestCase(idDelette);
        console.log(testCaseDelete);
        
    });

    $('#btn-up-file').click(function() {
        $('#up-file').fadeIn();
        $('#testcase').hide();
    });

    $('input[name=save]').off('click').on('click', () => {
        const dataRequest = {
            assignmentRequest: assignmentSv.getProblemDetails(),
            testCaseRequest: getTestCasesFromTable()
        };
        console.log(dataRequest);

        if (dataRequest.assignmentRequest && dataRequest.testCaseRequest.length > 0) {
            console.log('fetch testcase');
            $.ajax({
                url: `${API_URL}assignments/${id}`,
                type: 'PUT',
                contentType: 'application/json', 
                headers: {
                    'Authorization': `Bearer ${lcServices.getToken()}`
                },
                data: JSON.stringify(dataRequest),

                success: function (response) {
                    if (response.code == 1000) {
                        //fetchDeleteTestcase();
                        toastr.success('Cập nhật bài tập thành công', 'Thành công',{
                            closeButton: true,
                            progressBar: true,
                            setTimeout: 2000,
                            onHidden: () => { window.location.href = "/admin/assignment" }
                        });
                    }
                    
                },
                error: function (error) {
                    console.log('lỗi: ', error.responseJSON?.message);
                    toastr.error('Lỗi khi cập nhật bài tập', 'lỗi',{
                        closeButton: true,
                        progressBar: true
                    });
                }
            });
        }
        
    });
});
