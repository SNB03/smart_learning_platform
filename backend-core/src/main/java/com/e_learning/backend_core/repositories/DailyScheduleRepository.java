package com.e_learning.backend_core.repositories;

import com.e_learning.backend_core.models.DailySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyScheduleRepository extends JpaRepository<DailySchedule, Long> {
    // This query ensures we ONLY get schedules for a specific teacher for a specific day!
    List<DailySchedule> findByTeacherIdAndDateOrderByStartTimeAsc(Long teacherId, LocalDate date);

    List<DailySchedule> findByClassLevelAndDivisionAndDateOrderByStartTimeAsc(Integer classLevel, String division, LocalDate date);
}