package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.StudentGrade;
import com.e_learning.backend_core.services.StudentGradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")

public class StudentGradeController {
    @Autowired
    private StudentGradeService service;

    @GetMapping("/student/{studentId}")
    public List<StudentGrade> getReportCard(@PathVariable Long studentId) { return service.getGradesForStudent(studentId); }
}