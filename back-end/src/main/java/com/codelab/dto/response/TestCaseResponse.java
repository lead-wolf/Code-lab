package com.codelab.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestCaseResponse {
    Long id;
    String name;
    String input;
    String expectedOutput;
    int score;
    boolean markSampleTestCase;
}
