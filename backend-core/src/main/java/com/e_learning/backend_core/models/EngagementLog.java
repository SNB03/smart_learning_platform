package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "engagement_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngagementLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "attention_score", precision = 3, scale = 2)
    private BigDecimal attentionScore;

    @Column(name = "time_spent_seconds", nullable = false)
    private Integer timeSpentSeconds;

    @Column(name = "logged_at", insertable = false, updatable = false)
    private LocalDateTime loggedAt;
}