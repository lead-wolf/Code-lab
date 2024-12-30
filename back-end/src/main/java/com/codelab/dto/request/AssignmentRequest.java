package com.codelab.dto.request;

import com.codelab.entity.Language;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentRequest {
     @NotBlank(message = "TITLE_NOT_BLANK")
     String title;
     String description;
     String language;
     String solution;
     int timeLimit;
     int memoryLimit;
     @NotBlank(message = "LEVEL_NOT_BLANK")
     String level;
     boolean isMarkAsCertificationQuestion;
}
