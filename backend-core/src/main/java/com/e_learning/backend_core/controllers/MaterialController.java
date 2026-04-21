package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.StudyMaterial;
import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.repositories.StudyMaterialRepository;
import com.e_learning.backend_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/teacher/materials")
@CrossOrigin(origins = "http://localhost:5173")
public class MaterialController {

    @Autowired
    private StudyMaterialRepository materialRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. GET all materials (Optional: Add filtering by classLevel later)
    @GetMapping
    public ResponseEntity<List<StudyMaterial>> getAllMaterials() {
        List<StudyMaterial> materials = materialRepository.findAll(); // In production, filter by Teacher ID

        // Strip out the heavy byte arrays before sending to the frontend to keep the app fast
        materials.forEach(m -> m.setFileData(null));
        return ResponseEntity.ok(materials);
    }

    // 2. POST new material
    @PostMapping
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("classLevel") Integer classLevel,
            @RequestParam("subject") String subject,
            @RequestParam("authorId") Long authorId,
            @RequestParam(value = "url", required = false) String url,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            StudyMaterial material = new StudyMaterial();
            material.setTitle(title);
            material.setType(type);
            material.setClassLevel(classLevel);
            material.setSubject(subject);
            material.setCreatedAt(LocalDateTime.now());

            User author = userRepository.findById(authorId).orElseThrow();
            material.setAuthor(author);

            // If it's a web link
            if ("link".equals(type) && url != null) {
                material.setUrl(url);
            }
            // If it's a document upload
            else if ("file".equals(type) && file != null && !file.isEmpty()) {
                material.setFileName(file.getOriginalFilename());
                material.setFileType(file.getContentType());
                material.setFileData(file.getBytes());

                // Calculate size for the UI (e.g. "1.5 MB")
                double sizeInMB = (double) file.getSize() / (1024 * 1024);
                material.setFileSize(String.format("%.1f MB", sizeInMB));
            }

            StudyMaterial savedMaterial = materialRepository.save(material);
            savedMaterial.setFileData(null); // Clear byte array from response payload
            return ResponseEntity.ok(savedMaterial);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload material.");
        }
    }

    // 3. DELETE a material
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        if (materialRepository.existsById(id)) {
            materialRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}