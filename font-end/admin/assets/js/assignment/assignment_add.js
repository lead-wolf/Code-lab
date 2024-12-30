import  * as lcServices  from "/assets/services/localStorageService.js"
import { API_URL } from "/assets/js/configuration.js"

let testcaseIndex = 1;

/**
 * Cập nhật ID, name và reset giá trị của một trường testcase
 * @param {jQuery} fieldElement - Element nhóm testcase cần cập nhật
 * @param {number} testcaseIndex - Chỉ số của testcase
 */
export function updateTestcaseFields(fieldElement, testcaseIndex) {
    fieldElement.attr('id', `field${testcaseIndex}`);
    fieldElement.find('input, textarea, p').each(function () {
        const oldId = $(this).attr('id');
        if (oldId) {
            $(this).attr('id', oldId.replace(/\d+$/, testcaseIndex));
        }

        if ($(this).is('input, textarea')) {
            $(this).val('');
        }

        // Ẩn thông báo lỗi
        if ($(this).is('p')) {
            $(this).hide();
        }

        fieldElement.find('input[type="checkbox"]').prop('checked', false);
    });
}

export function collectTestCases() {
    let isValid = true;
    let listTestCase = [];

    $('.testcase-item').each(function () {
        const currenttestcaseIndex = $(this).attr('id').replace('field', '');

        // Lấy giá trị các trường
        const name = $(`#TSName${currenttestcaseIndex}`).val().trim();
        const score = $(`#TSScore${currenttestcaseIndex}`).val().trim();
        const input = $(`#TSInput${currenttestcaseIndex}`).val().trim();
        const output = $(`#TSOutput${currenttestcaseIndex}`).val().trim();

        // // Xử lý tên testcase
        // if (!name) {
        //     $(`#name-error${currenttestcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#name-error${currenttestcaseIndex}`).hide();
        // }

        // // Xử lý điểm
        // if (!score || isNaN(score) || Number(score) <= 0) {
        //     $(`#score-error${currenttestcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#score-error${currenttestcaseIndex}`).hide();
        // }

        // // Xử lý đầu vào
        // if (!input) {
        //     $(`#input-error${currenttestcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#input-error${currenttestcaseIndex}`).hide();
        // }

        // // Xử lý kết quả mong đợi
        // if (!output) {
        //     $(`#output-error${currenttestcaseIndex}`).show();
        //     isValid = false;
        // } else {
        //     $(`#output-error${currenttestcaseIndex}`).hide();
        // }

        isValid = true;
        if (isValid) {
            const testCase = {
                name: $(this).find('input[id^="TSName"]').val().trim(),
                input: $(this).find('textarea[id^="TSInput"]').val().trim(),
                expectedOutput: $(this).find('textarea[id^="TSOutput"]').val().trim(),
                score: $(this).find('input[id^="TSScore"]').val().trim(),
                markSampleTestCase: $(this).find('input[type="checkbox"]').is(':checked'),
            };
            listTestCase.push(testCase);
        }
        
    });
    
    if (!isValid) {
        toastr.error(`Vui lòng kiểm tra lại dữ liệu nhập!`, 'Lỗi', {
            closeButton: true,
            progressBar: true
        });
        return null;
    }
    return listTestCase;
}

export function stepOne(){
    let isValid = true;
    let titleValue = $('#title').val().trim();
    let timeLimit = $('input[name="memoryLimit"]').val().trim();
    
    if (titleValue === '') {
        $('#error-title').show();
        $('#title').css('border', '1px solid #a94442');
        isValid = false;
    }else{
        $('#error-title').hide();
        $('#title').css('border', '');
        isValid = true;
    } 

    if (timeLimit !== '' && (isNaN(timeLimit) || timeLimit < 2048)) {
        $('#error-timeLimit').show();
        $('input[name="memoryLimit"]').css('border', '1px solid #a94442');
        isValid = false;
    } else {
        $('#error-timeLimit').hide();
        $('input[name="memoryLimit"]').css('border', '');
    }
    

    if (isValid) {
        // $('#error-title').hide();
        // $('#title').css('border', '');
        $('#problem-details').hide();
        $('#personal').addClass('active');
        $('#testcase').fadeIn();   
    }else {
        console.log("run");
        
        toastr.error(`Vui lòng kiểm tra lại dữ liệu nhập!`, 'Lỗi', {
            closeButton: true,
            progressBar: true
        });     
    }
}

export function goBack(){
    $('#testcase').hide();  
    $('#personal').removeClass('active');
    $('#problem-details').fadeIn();  
}

export function addMoreTestCase(){
    let newField = $('#field0').clone();
    let newBtnRm = $('#add-more').clone();
    
    newBtnRm.attr('id', `remove${testcaseIndex}`)
            .text('Xoá')
            .css('background-color', '#f1536e');
    
    // Cập nhật ID và name cho các trường
    updateTestcaseFields(newField, testcaseIndex);
    $('#field').append(newBtnRm);
    $('#field').append(newField);

    testcaseIndex++; 
}

export function getProblemDetails() {
    const problemDetails = {
        isCertificateQuestion: $('input[name="isCertificateQuestion"]').is(':checked'),
        title: $('input[name="title"]').val().trim(),
        timeLimit: $('input[name="timeLimit"]').val().trim(),
        memoryLimit: $('input[name="memoryLimit"]').val().trim(),
        level: $('select[name="level"]').val(),
        language: $('select[name="language-selected"]').val(),
        description: $('#summernote').summernote('code'),
    };

    return problemDetails;
}

function saveTestCase(){
    let testCases = collectTestCases();
    const requestData = {
        assignmentRequest: getProblemDetails(),
        testCaseRequest: testCases 
    };
    
    if (testCases) {
        $.ajax({
            url: `${API_URL}assignments`,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${lcServices.getToken()}`, 
            },
            data: JSON.stringify(requestData),

            success: function (response) {
                toastr.success('Thành công', 'Thành công',{
                    closeButton: true,
                    progressBar: true
                });
                window.location.href = "/admin/assignment";
            },
            error: function (error) {
                console.log('lỗi: ', error.responseJSON?.message); 
                toastr.error('Không thể xử lý yêu cầu', 'lỗi',{
                    closeButton: true,
                    progressBar: true
                });
            }
        });
    }else{
        return;
    }
}

export function removeTestCase(obj){
    const index = obj.attr('id').replace('remove', '');
    obj.remove();
    $(`#field${index}`).remove(); 
}

$(function() {

    // {
    //     $('#up-file').fadeIn();
    //     $('#testcase').hide();
    //     $('#problem-details').hide();
    // }

    $('#step-one').click(stepOne);

    $('#goback').click(goBack);

    $('#add-more').click(addMoreTestCase);

    $('#save-testcase').click(saveTestCase);

    $('#field').on('click', '[id^="remove"]', function() {
        removeTestCase($(this))
    });

    $('#btn-up-file').click(function() {
        $('#up-file').fadeIn();
        $('#testcase').hide();
    });

    $('#btn-fill-testcase').click(function() {
        $('#up-file').hide();
        $('#testcase').fadeIn();
    })

    $('input[name=previous]').on('click', function() {
        $('#up-file').hide();
        $('#testcase').hide();
        $('#problem-details').fadeIn();
    })

    $('input[name=save]').on('click', function() {
        
    })
});