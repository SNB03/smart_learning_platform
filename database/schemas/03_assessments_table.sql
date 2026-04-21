CREATE TABLE quizzes (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         material_id BIGINT NOT NULL,
                         title VARCHAR(200) NOT NULL,
                         is_ai_generated BOOLEAN DEFAULT FALSE, -- Flags if the NLP model built it
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

CREATE TABLE questions (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           quiz_id BIGINT NOT NULL,
                           question_text TEXT NOT NULL,
                           question_type ENUM('MCQ', 'SHORT_ANSWER') NOT NULL,
                           options JSON, -- Stores choices like {"A": "Cat", "B": "Dog"}
                           correct_answer TEXT NOT NULL,
                           FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE student_scores (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                student_id BIGINT NOT NULL,
                                quiz_id BIGINT NOT NULL,
                                score DECIMAL(5,2),
                                ai_feedback TEXT, -- NLP auto-grading feedback for short answers
                                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);