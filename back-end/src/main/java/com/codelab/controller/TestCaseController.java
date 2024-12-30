package com.codelab.controller;


import com.codelab.dto.request.TestCaseRequest;
import com.codelab.dto.response.ApiResponse;
import com.codelab.dto.response.TestCaseResponse;
import com.codelab.service.TestCaseService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/testcase")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TestCaseController {
    TestCaseService testCaseService;

    @GetMapping("/{testCaseId}")
    ApiResponse<TestCaseResponse> getTestCaseWithId(@PathVariable Integer testCaseId){
        return ApiResponse.<TestCaseResponse>builder()
                .result(testCaseService.getTestCaseWithId(testCaseId))
                .build();
    }

    @GetMapping("/all/{assignmentId}")
    ApiResponse<List<TestCaseResponse>> getTestCase(@PathVariable Integer assignmentId){
        return ApiResponse.<List<TestCaseResponse>>builder()
                .result(testCaseService.getTestCase(assignmentId))
                .build();
    }

    @GetMapping
    ApiResponse<List<TestCaseResponse>> getTestCases(){
        return ApiResponse.<List<TestCaseResponse>>builder()
                .result(testCaseService.getTestCases())
                .build();
    }

    @PostMapping
    ApiResponse<List<TestCaseResponse>> createTestCase(@RequestBody @Valid List<TestCaseRequest> requests){
        return ApiResponse.<List<TestCaseResponse>>builder()
                .result(testCaseService.createTestCases(requests))
                .build();
    }

    @PutMapping
    ApiResponse<List<TestCaseResponse>> updateTestCase(@RequestBody @Valid List<TestCaseRequest> requests){
        return ApiResponse.<List<TestCaseResponse>>builder()
                .result(testCaseService.updateTestCase(requests))
                .build();
    }

    @PostMapping("/delete")
    void deleteTestCase(@RequestBody List<Integer> listId){
        testCaseService.deleteTestCases(listId);
    }
}
