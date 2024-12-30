package com.codelab.controller;

import com.codelab.dto.request.AssignmentRequest;
import com.codelab.dto.request.AssignmentRequestWrapper;
import com.codelab.dto.request.TestCaseRequest;
import com.codelab.dto.response.ApiResponse;
import com.codelab.dto.response.AssignmentResponse;
import com.codelab.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assignments")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AssignmentController {
    AssignmentService service;

    @PostMapping
    ApiResponse<AssignmentResponse> createAssignment(@RequestBody @Valid AssignmentRequestWrapper requestWrapper) {
        return ApiResponse.<AssignmentResponse>builder()
                .result(service.createAssignment(requestWrapper))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<AssignmentResponse> getAssignment(@PathVariable Long id){
        return ApiResponse.<AssignmentResponse>builder()
                .result(service.getAssignment(id))
                .build();
    }

    @GetMapping
    ApiResponse<List<AssignmentResponse>> getAssignmentList(){
        return ApiResponse.<List<AssignmentResponse>>builder()
                .result(service.getAssignmentResponseList())
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<AssignmentResponse> updateAssignment(@PathVariable Long id, @RequestBody AssignmentRequestWrapper request){
        return ApiResponse.<AssignmentResponse>builder()
                .result(service.updateAssignmentAndTestCase(id, request))
                .build();
    }


    @DeleteMapping("/{id}")
    void deleteAssignment(@PathVariable Long id){
        service.deleteAssignment(id);
    }
}
