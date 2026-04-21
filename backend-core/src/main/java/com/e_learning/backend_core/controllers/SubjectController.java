package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.Subject;
import com.e_learning.backend_core.services.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:5173")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    // Get all subjects (e.g., for Admin dashboard)
    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    // Get subjects for a specific class (e.g., Student in Class 5 only sees Class 5 subjects)
    @GetMapping("/class/{level}")
    public List<Subject> getSubjectsByClass(@PathVariable Integer level) {
        return subjectService.getSubjectsByClassLevel(level);
    }

    // Admin creates a new subject
    @PostMapping
    public Subject createSubject(@RequestBody Subject subject) {
        return subjectService.createSubject(subject);
    }
}