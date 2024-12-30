package com.codelab.entity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "assessments")
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submission_id")
    private Submission submission;

    private double executionTime;
    private double memoryUsed;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String myOutput;
    private Boolean ispassed;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testcase_id")
    private TestCase testCase;
}
