package com.codelab.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EditorContentResponse {
    @NotBlank
    String editorContent;
    @NotBlank
    String mode;
    @NotBlank
    String language_name;
    @NotBlank
    String current_tab_id;
}
