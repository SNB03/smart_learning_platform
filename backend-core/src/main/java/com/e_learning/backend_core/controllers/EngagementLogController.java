package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.EngagementLog;
import com.e_learning.backend_core.services.EngagementLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/analytics")

public class EngagementLogController {
    @Autowired
    private EngagementLogService service;

    @PostMapping("/track")
    public EngagementLog trackAttention(@RequestBody EngagementLog log) { return service.logEngagement(log); }
}