package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "teacher_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonIgnore
    private User teacher;

    @Column(name = "class_level", nullable = false)
    private Integer classLevel;

    @Column(nullable = false)
    private String division;

    // NEW: "class" or "subject"
    @Column(name = "assignment_role", nullable = false)
    private String assignmentRole;

    @Column(name = "subject_name")
    private String subjectName;
}