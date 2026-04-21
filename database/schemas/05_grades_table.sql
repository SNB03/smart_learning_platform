CREATE TABLE student_grades (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                student_id BIGINT NOT NULL,
                                subject_id BIGINT NOT NULL,
                                academic_term VARCHAR(50) NOT NULL, -- e.g., 'Mid-Term', 'Finals'

    -- Calculated Grades
                                overall_percentage DECIMAL(5,2),
                                grade_letter VARCHAR(5), -- e.g., 'A+', 'B', 'C'

    -- AI & Teacher Feedback
                                ai_generated_summary TEXT, -- AI drafts a summary based on all quiz scores and attention logs
                                teacher_remarks TEXT,      -- The teacher's finalized, personal comment

                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,

    -- This ensures a student only gets one final grade per subject, per term
                                UNIQUE (student_id, subject_id, academic_term)
);