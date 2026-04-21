package com.e_learning.backend_core.services;

import com.e_learning.backend_core.models.EngagementLog;
import com.e_learning.backend_core.repositories.EngagementLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EngagementLogService {
    @Autowired
    private EngagementLogRepository repository;

    // This is the endpoint your React frontend will hit every few minutes
    // while a student is watching a video to feed the AI!
    public EngagementLog logEngagement(EngagementLog log) {
        return repository.save(log);
    }
}