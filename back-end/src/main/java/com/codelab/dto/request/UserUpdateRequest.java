package com.codelab.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String email;
    String fullName;
    String education;
    String skills;
    String workExperiences;
    String certificates;
    String avatarUrl;
    String password;
    boolean active;
    Set<String> roles;
}
