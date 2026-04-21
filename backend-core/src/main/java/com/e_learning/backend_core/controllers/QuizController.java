package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.Quiz;
import com.e_learning.backend_core.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/material/{materialId}")
    public List<Quiz> getQuizzesForMaterial(@PathVariable Long materialId) {
        return quizService.getQuizzesByMaterialId(materialId);
    }

    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizService.createQuiz(quiz);
    }
}