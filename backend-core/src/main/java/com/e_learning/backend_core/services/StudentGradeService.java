package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.StudentGrade;
import com.e_learning.backend_core.repositories.StudentGradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentGradeService {
    @Autowired
    private StudentGradeRepository repository;

    public List<StudentGrade> getGradesForStudent(Long studentId) {
        // Add to repository: List<StudentGrade> findByStudentId(Long studentId);
        return repository.findByStudentId(studentId);
    }

    public StudentGrade saveFinalGrade(StudentGrade grade) {
        return repository.save(grade);
    }
}