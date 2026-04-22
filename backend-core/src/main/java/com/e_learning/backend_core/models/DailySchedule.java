package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "daily_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailySchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    // This is the magic field: The schedule will only fetch if this matches TODAY
    @Column(name = "schedule_date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "end_time", nullable = false)
    private String endTime;

    @Column(name = "period_type", nullable = false)
    private String type; // e.g., "Subject", "Class Teacher Period", "Free Period"

    @Column(name = "class_level")
    private Integer classLevel;

    private String division;
    private String subject;
    private String room;
}