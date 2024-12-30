package com.codelab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @Column(name = "full_name", length = 127)
    private String fullName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String education;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String skills;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String workExperiences;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String certificates;

    @Column(name = "password")
    private String password;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    @ManyToMany
    private Set<Role> roles;

    @OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Assignment> assignments;

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Contest> createdContests;

    @OneToMany(mappedBy = "createdUser", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Question> questions;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Apply> applies;

    @OneToMany(mappedBy = "userAdded", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AssignmentKit> assignmentKits;

    @OneToMany(mappedBy = "userSubmitted", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AssignmentKitSubmission> assignmentKitSubmissions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Comment> comments;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Submission> submissions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SolutionCheck> solutionChecks;
    {
        solutionChecks = new ArrayList<>();
    }

    @ManyToMany(mappedBy = "teachers")
    @JsonIgnore
    private Set<Contest> contests;
    {
        contests = new HashSet<>();
    }

    public String getImagesPath(){
        if(avatarUrl == null || id == null) return null;
        return "/avt-images/" + id + "/" + avatarUrl;
    }

}
