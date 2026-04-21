CREATE TABLE engagement_logs (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 student_id BIGINT NOT NULL,
                                 material_id BIGINT NOT NULL,

    -- AI Reinforcement Learning Metrics
                                 attention_score DECIMAL(3,2), -- A calculated metric (e.g., 0.00 to 1.00)
                                 time_spent_seconds INT NOT NULL,

                                 logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                                 FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);