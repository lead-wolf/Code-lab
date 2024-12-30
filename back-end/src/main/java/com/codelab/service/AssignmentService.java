package com.codelab.service;

import com.codelab.dto.request.AssignmentRequest;
import com.codelab.dto.request.AssignmentRequestWrapper;
import com.codelab.dto.request.TestCaseRequest;
import com.codelab.dto.response.AssignmentResponse;
import com.codelab.entity.*;
import com.codelab.exception.AppException;
import com.codelab.exception.ErrorCode;
import com.codelab.mapper.AssignmentMapper;
import com.codelab.mapper.TestCaseMapper;
import com.codelab.respository.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Service
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AssignmentService {
    AssignmentRepository assignmentRepository;
    UserRepository userRepository;
    LevelRopository levelRopository;
    LanguageRepository languageRepository;
    TestCaseRepository testCaseRepository;
    AssignmentMapper assignmentMapper;
    TestCaseMapper testCaseMapper;

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public AssignmentResponse createAssignment(AssignmentRequestWrapper requestWrapper){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();
        Assignment assignment = assignmentMapper.toAssignment(requestWrapper.getAssignmentRequest());
        if (assignment.getTestCases() == null){
            assignment.setTestCases(new ArrayList<>());
        }
        User user =  userRepository.findByEmail(email)
                        .orElseThrow( () -> new AppException(ErrorCode.USER_NOT_EXISTED) );
        Level level = levelRopository.findById(Long.valueOf(requestWrapper.getAssignmentRequest().getLevel()))
                        .orElseThrow( () -> new AppException(ErrorCode.NOT_EXISTED));
        if (requestWrapper.getAssignmentRequest().getLanguage() != null &&
                !requestWrapper.getAssignmentRequest().getLanguage().trim().isEmpty()){
            Language language =languageRepository.findById(Long.valueOf(requestWrapper.getAssignmentRequest().getLanguage()))
                    .orElseThrow( () -> new AppException(ErrorCode.NOT_EXISTED));
            assignment.setLanguage(language);
        }
        assignment.setLecturer(user);
        assignment.setLevel(level);

        requestWrapper.getTestCaseRequest().forEach(testCaseRequestItem -> {
            TestCase testCase = testCaseMapper.toTestCase(testCaseRequestItem);
            testCase.setAssignment(assignment);
            assignment.getTestCases().add(testCase);
        });

        try {
            assignmentRepository.save(assignment);
        }catch (Exception e){
            throw new RuntimeException(e);
        }

        return assignmentMapper.toAssignmentResponse(assignment);
    }

    public AssignmentResponse getAssignment(Long id) {
        return assignmentMapper.toAssignmentResponse(
                assignmentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_EXISTED))
        );
    }

    public List<AssignmentResponse> getAssignmentResponseList(){
        return assignmentRepository.findAll().stream().map(assignmentMapper::toAssignmentResponse).toList();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public AssignmentResponse updateAssignmentResponse(Long id, AssignmentRequest assignmentRequest){
        Optional<Assignment> assessment = assignmentRepository.findById(id);
        if (assessment.isEmpty()) throw new AppException(ErrorCode.NOT_EXISTED);
        assignmentMapper.update(assessment.get(), assignmentRequest);
        return assignmentMapper.toAssignmentResponse(assignmentRepository.save(assessment.get()));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public AssignmentResponse updateAssignmentAndTestCase(Long id, AssignmentRequestWrapper requestWrapper){
        Optional<Assignment> assignment = assignmentRepository.findById(id);
        if (assignment.isEmpty()) {
            throw new AppException(ErrorCode.NOT_EXISTED);
        }

        assignmentMapper.update(assignment.get(), requestWrapper.getAssignmentRequest());
        Level levelUpdate = levelRopository.findById(Long.valueOf(requestWrapper.getAssignmentRequest().getLevel()))
                        .orElseThrow( () -> new AppException(ErrorCode.NOT_EXISTED));
        assignment.get().setLevel(levelUpdate);

        assignment.get().getTestCases().clear();
        requestWrapper.getTestCaseRequest().forEach(item -> {
            TestCase testCase = testCaseRepository.findById(item.getId())
                    .map(existingTestCase -> {
                        testCaseMapper.updateTestCase(existingTestCase, item);
                        return existingTestCase;
                    })
                    .orElseGet(() -> {
                        TestCase newTestCase = testCaseMapper.toTestCase(item);
                        newTestCase.setAssignment(assignment.get());
                        return newTestCase;
                    });

            assignment.get().getTestCases().add(testCase);
        });

        return assignmentMapper.toAssignmentResponse(assignmentRepository.save(assignment.get()));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public void deleteAssignment(Long id){
        Assignment assignment = assignmentRepository.findById(id).orElseThrow( () -> new AppException(ErrorCode.NOT_EXISTED));

//        submissionRepository.deleteByAssignmentId(id);
//        testCaseRepository.deleteByAssignmentId(id);
//        commentRepository.deleteByAssignmentId(id);
//        solutionCheckRepository.deleteByAssignmentId(id);

        assignmentRepository.delete(assignment);
    }
}
