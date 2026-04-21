package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.StudentScore;
import com.e_learning.backend_core.repositories.StudentScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentScoreService {
    @Autowired
    private StudentScoreRepository repository;

    public StudentScore saveScore(StudentScore score) {
        return repository.save(score);
    }

    public List<StudentScore> getScoresByStudent(Long studentId) {
        // Add to repository: List<StudentScore> findByStudentId(Long studentId);
        return repository.findByStudentId(studentId);
    }
}