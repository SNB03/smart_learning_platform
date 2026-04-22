package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "material_id", nullable = true) // Made nullable in case a quiz is standalone
    private Material material;

    @Column(nullable = false)
    private String title;

    // --- NEW FIELDS REQUIRED BY FRONTEND ---
    @Column(name = "class_level", nullable = false)
    private Integer classLevel;

    @Column(nullable = false)
    private String subject;

    @Column(name = "time_limit")
    private Integer timeLimit; // In minutes

    @Column(name = "due_date")
    private String dueDate;
    // ---------------------------------------

    @Column(name = "is_ai_generated")
    private Boolean isAiGenerated = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}