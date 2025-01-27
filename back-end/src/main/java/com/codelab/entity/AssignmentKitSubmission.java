package com.codelab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "assignment_kit_submission")
public class AssignmentKitSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean isSuccess;

    @Column(name = "submitted_at")
    @CreationTimestamp
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "assignmentKitSubmission", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Submission> submissions;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_kit_id")
    @JsonIgnore
    private AssignmentKit assignmentKit;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User userSubmitted;


}
