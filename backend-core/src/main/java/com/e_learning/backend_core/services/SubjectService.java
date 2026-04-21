package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.Subject;
import com.e_learning.backend_core.repositories.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Subject> getSubjectsByClassLevel(Integer classLevel) {
        // You'll need to add this custom method to your SubjectRepository:
        // List<Subject> findByClassLevel(Integer classLevel);
        // I will show you how below!
        return subjectRepository.findByClassLevel(classLevel);
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
}