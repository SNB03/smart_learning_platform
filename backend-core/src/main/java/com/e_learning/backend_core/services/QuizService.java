package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.Quiz;
import com.e_learning.backend_core.repositories.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public List<Quiz> getQuizzesByMaterialId(Long materialId) {
        // Add to QuizRepository: List<Quiz> findByMaterialId(Long materialId);
        return quizRepository.findByMaterialId(materialId);
    }

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }
}