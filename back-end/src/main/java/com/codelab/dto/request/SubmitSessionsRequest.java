package com.codelab.dto.request;

import com.codelab.entity.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class SubmitSessionsRequest {
//    @NotBlank
//    private String studentId;
    private String language;
    private int totalScore;
    @NotBlank
    private String sourceCode;
    private Boolean isSuccess;
    private LocalDateTime submittedAt;
    private String assessmentsId;
    private Question quiz;
}
