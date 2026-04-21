package com.e_learning.backend_core.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "class_notices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "notice_type", nullable = false)
    private String type; // 'info', 'homework', 'urgent'

    // To target specific classes
    @Column(name = "class_level", nullable = false)
    private Integer classLevel;

    @Column(nullable = false)
    private String division;

    // Who posted it
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User author;

    // File Attachment Data
    @Column(name = "attachment_name")
    private String attachmentName;

    @Column(name = "attachment_type")
    private String attachmentType;

    @Lob // For storing the actual file data in the database (or you could store a path to an S3 bucket/local folder)
    @Column(name = "attachment_data", columnDefinition = "LONGBLOB")
    private byte[] attachmentData;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}