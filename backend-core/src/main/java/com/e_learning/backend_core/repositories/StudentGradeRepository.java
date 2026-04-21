package com.e_learning.backend_core.repositories;
import com.e_learning.backend_core.models.StudentGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface StudentGradeRepository extends JpaRepository<StudentGrade,Long> {
    List<StudentGrade> findByStudentId(Long studentId);
}
