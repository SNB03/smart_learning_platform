package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    @Autowired
    private UserRepository userRepository;

    // 1. Get all students for a specific Class & Division
    @GetMapping("/students")
    public ResponseEntity<List<User>> getClassStudents(
            @RequestParam Integer classLevel,
            @RequestParam String division) {

        // You will need to add this method to UserRepository:
        // List<User> findByRoleAndClassLevelAndDivision(User.Role role, Integer classLevel, String division);
        List<User> students = userRepository.findByRoleAndClassLevelAndDivision(User.Role.STUDENT, classLevel, division);
        return ResponseEntity.ok(students);
    }

    // 2. Add a new Student
    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody User student) {
        try {
            student.setRole(User.Role.STUDENT);
            student.setStatus("active");

            // Generate Password (First Name + Roll No)
            String generatedPassword = student.getFullName().split(" ")[0].toLowerCase() + student.getRollNo();
            student.setPasswordHash(generatedPassword);

            User savedStudent = userRepository.save(student);
            return ResponseEntity.ok(savedStudent);

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Error: Email or Mobile already exists!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to save student.");
        }
    }
}