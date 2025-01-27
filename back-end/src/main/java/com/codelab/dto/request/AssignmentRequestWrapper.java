package com.codelab.dto.request;

import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentRequestWrapper {
    @Valid
    AssignmentRequest assignmentRequest;
    @Valid
    List<TestCaseRequest> testCaseRequest;
}
