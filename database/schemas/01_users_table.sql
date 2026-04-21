CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       full_name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
                       class_level INT DEFAULT NULL, -- Restrict to 5-10 in application logic
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);