package com.e_learning.backend_core.repositories;

import com.e_learning.backend_core.models.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByClassLevel(Integer classLevel);

}