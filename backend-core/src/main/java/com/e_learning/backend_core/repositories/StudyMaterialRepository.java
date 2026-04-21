package com.e_learning.backend_core.repositories;

import com.e_learning.backend_core.models.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
}
