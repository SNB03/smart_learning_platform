package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    // NEW: Mobile Number Field
    @Column(name = "mobile_no", unique = true, length = 20)
    private String mobileNo;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "status")
    private String status = "active"; // Good practice to set a default


    public enum Role {
        ADMIN, TEACHER, STUDENT
    }
    @Column(name = "teacher_type")
    private String teacherType;
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeacherAssignment> assignments;
    // --- NEW STUDENT FIELDS ---
    @Column(name = "roll_no")
    private String rollNo;

    @Column(name = "gender")
    private String gender;

    @Column(name = "parent_mobile_no")
    private String parentMobileNo;
    @Column(name = "class_level")
    private Integer classLevel;
    // (Make sure you already have classLevel and division in this file!)
    @Column(name = "division")
    private String division;
}