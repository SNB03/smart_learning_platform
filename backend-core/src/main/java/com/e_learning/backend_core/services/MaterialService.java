package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.Material;
import com.e_learning.backend_core.repositories.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    public List<Material> getMaterialsBySubjectId(Long subjectId) {
        // You'll need to add this custom method to your MaterialRepository:
        // List<Material> findBySubjectId(Long subjectId);
        return materialRepository.findBySubjectId(subjectId);
    }

    public Material uploadMaterial(Material material) {
        return materialRepository.save(material);
    }
}