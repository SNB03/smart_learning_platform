package com.e_learning.backend_core.repositories;

import com.e_learning.backend_core.models.StudentScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface StudentScoreRepository extends JpaRepository<StudentScore,Long> {
    List<StudentScore> findByStudentId(Long studentId);
}
