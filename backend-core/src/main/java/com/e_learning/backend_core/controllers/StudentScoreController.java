package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.Question;
import com.e_learning.backend_core.models.StudentScore;
import com.e_learning.backend_core.services.QuestionService;
import com.e_learning.backend_core.services.StudentScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/scores")

public class StudentScoreController {
    @Autowired
    private StudentScoreService service;

    @PostMapping
    public StudentScore submitQuiz(@RequestBody StudentScore score) { return service.saveScore(score); }

    @GetMapping("/student/{studentId}")
    public List<StudentScore> getScores(@PathVariable Long studentId) { return service.getScoresByStudent(studentId); }
}