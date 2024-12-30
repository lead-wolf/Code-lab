package com.codelab.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EditorContentRequest {
    @NotBlank
    String editorContent;
    @NotBlank
    String mode;
    @NotBlank
    String language_name;
    @NotBlank
    String current_tab_id;
}
