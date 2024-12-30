package com.codelab.dto.response;

import com.codelab.entity.Language;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentResponse {
     Long id;
     String title;
     String description;
     String language;
     String solution;
     int timeLimit;
     int memoryLimit;
     int maxScore;
     boolean markAsCertificationQuestion;
     String level;
}
