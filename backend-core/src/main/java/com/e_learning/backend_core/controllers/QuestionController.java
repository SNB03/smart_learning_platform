package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.Question;
import com.e_learning.backend_core.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")

public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/quiz/{quizId}")
    public List<Question> getQuestionsForQuiz(@PathVariable Long quizId) {
        return questionService.getQuestionsByQuizId(quizId);
    }

    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionService.addQuestion(question);
    }

    // The endpoint your Python AI will hit to inject 10 questions at once
    @PostMapping("/batch")
    public List<Question> addMultipleQuestions(@RequestBody List<Question> questions) {
        return questionService.addMultipleQuestions(questions);
    }
}