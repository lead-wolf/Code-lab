package com.codelab.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "test_cases")
public class TestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id", referencedColumnName = "id")
    @JsonIgnore
    private Assignment assignment;

    private String name;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String input;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String expectedOutput;

    private int score;

    private boolean markSampleTestCase;

//    @OneToMany(mappedBy = "testCase", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private List<Assessment> assessments;

}


