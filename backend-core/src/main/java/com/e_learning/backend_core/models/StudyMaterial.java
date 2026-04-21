package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type; // 'file' or 'link'

    @Column(name = "class_level", nullable = false)
    private Integer classLevel;

    @Column(nullable = false)
    private String subject;

    // For Links
    @Column(name = "url_link")
    private String url;

    // For Files
    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private String fileSize; // Storing as a readable string like "2.4 MB"

    @Lob
    @Column(name = "file_data", columnDefinition = "LONGBLOB")
    private byte[] fileData;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User author;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}