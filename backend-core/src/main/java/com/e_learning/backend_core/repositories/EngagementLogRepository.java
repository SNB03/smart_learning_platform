package com.e_learning.backend_core.repositories;
import com.e_learning.backend_core.models.EngagementLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface EngagementLogRepository extends JpaRepository<EngagementLog,Long> {
}
