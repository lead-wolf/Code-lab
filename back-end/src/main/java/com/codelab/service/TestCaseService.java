package com.codelab.service;

import com.codelab.dto.request.TestCaseRequest;
import com.codelab.dto.response.TestCaseResponse;
import com.codelab.entity.TestCase;
import com.codelab.exception.AppException;
import com.codelab.exception.ErrorCode;
import com.codelab.mapper.TestCaseMapper;
import com.codelab.respository.TestCaseRepository;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Builder
@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TestCaseService {
    TestCaseRepository testCaseRepository;
    TestCaseMapper testCaseMapper;

    private TestCase createTestCase(TestCaseRequest testCaseRequest){
        TestCase testCase = testCaseMapper.toTestCase(testCaseRequest);
        try {
            testCaseRepository.save(testCase);
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
        return testCase;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public List<TestCaseResponse> createTestCases(List<TestCaseRequest> testCaseRequest){
        List<TestCaseResponse> testCaseResponses = new ArrayList<>();
        testCaseRequest.forEach(item -> {
            testCaseResponses.add(testCaseMapper.toTestCaseResponse(createTestCase(item)));
        });

        return testCaseResponses;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public List<TestCaseResponse> updateTestCase(List<TestCaseRequest> testCaseRequests){
        List<TestCase> testCases = new ArrayList<>();
        testCaseRequests.forEach(item -> {
           Optional<TestCase> testCase= testCaseRepository.findById(item.getId());
           if (testCase.isPresent()){
               testCaseMapper.updateTestCase(testCase.get(), item);
               testCases.add(testCase.get());
           }else {
                testCases.add(createTestCase(item));
           }
        });

        try {
            testCaseRepository.saveAll(testCases);
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return testCases.stream().map(testCaseMapper::toTestCaseResponse).toList();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public void deleteTestCases(List<Integer> id){
        testCaseRepository.deleteAllById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public TestCaseResponse getTestCaseWithId(Integer id){
        return testCaseMapper.toTestCaseResponse(
                testCaseRepository.findById(id).orElseThrow( () ->new AppException(ErrorCode.NOT_EXISTED))
        );
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public List<TestCaseResponse> getTestCases(){
        return testCaseRepository.findAll().stream().map(testCaseMapper::toTestCaseResponse).toList();
    }

    public List<TestCaseResponse> getTestCase(Integer assignmentId){
        return testCaseRepository.findByAssignment(assignmentId)
                .map(testCases -> testCases.stream()
                        .map(testCaseMapper::toTestCaseResponse)
                        .toList()
                )
                .orElse(Collections.emptyList());
    }
}
