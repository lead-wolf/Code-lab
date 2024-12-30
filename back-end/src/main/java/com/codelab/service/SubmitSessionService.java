package com.codelab.service;

import com.codelab.dto.request.SubmitSessionsRequest;
import com.codelab.entity.Assignment;
import com.codelab.entity.Language;
import com.codelab.entity.Submission;
import com.codelab.entity.User;
import com.codelab.exception.AppException;
import com.codelab.exception.ErrorCode;
import com.codelab.respository.AssignmentRepository;
import com.codelab.respository.LanguageRepository;
import com.codelab.respository.SubmitRepository;
import com.codelab.respository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Builder
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubmitSessionService {
    UserRepository userRepository;
    AssignmentRepository assignmentRepository;
    LanguageRepository languageRepository;
    SubmitRepository submitRepository;

    public void createSubmit(SubmitSessionsRequest request){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow( () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Assignment assignment = assignmentRepository.findById(Long.valueOf(request.getAssessmentsId()))
                .orElseThrow(() -> new  AppException(ErrorCode.UNCATEGORIZED_EXCEPTION)) ;
        Submission submission = new Submission();

        if (request.getLanguage() != null &&
                !request.getLanguage().trim().isEmpty()){
            Language language =languageRepository.findById(Long.valueOf(request.getLanguage()))
                    .orElseThrow( () -> new AppException(ErrorCode.NOT_EXISTED));
            submission.setLanguage(language);
        }

        submission.setAssignment(assignment);
        submission.setStudent(user);
        submission.setTotalScore(request.getTotalScore());
        submission.setSubmittedAt(request.getSubmittedAt());
        submission.setSourceCode(request.getSourceCode());
        submission.setIsSuccess(request.getIsSuccess());

        submitRepository.save(submission);
    }
}
