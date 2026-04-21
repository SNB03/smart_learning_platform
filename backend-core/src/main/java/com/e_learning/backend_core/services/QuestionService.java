package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.Question;
import com.e_learning.backend_core.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getQuestionsByQuizId(Long quizId) {
        // Add to QuestionRepository: List<Question> findByQuizId(Long quizId);
        return questionRepository.findByQuizId(quizId);
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    // This allows the AI to send a whole list of questions at once!
    public List<Question> addMultipleQuestions(List<Question> questions) {
        return questionRepository.saveAll(questions);
    }
}