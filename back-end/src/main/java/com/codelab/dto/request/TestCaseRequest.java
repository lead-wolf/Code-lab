package com.codelab.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestCaseRequest {
    int id;
    String name;
    String input;
    String expectedOutput;
    @NotNull
    int score;
    @NotNull
    boolean markSampleTestCase;

}
