package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "academic_term", nullable = false)
    private String academicTerm;

    @Column(name = "overall_percentage", precision = 5, scale = 2)
    private BigDecimal overallPercentage;

    @Column(name = "grade_letter", length = 5)
    private String gradeLetter;

    @Column(name = "ai_generated_summary", columnDefinition = "TEXT")
    private String aiGeneratedSummary;

    @Column(name = "teacher_remarks", columnDefinition = "TEXT")
    private String teacherRemarks;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}