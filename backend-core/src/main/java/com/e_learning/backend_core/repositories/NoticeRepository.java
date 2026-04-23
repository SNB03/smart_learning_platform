package com.e_learning.backend_core.repositories;

import com.e_learning.backend_core.models.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // For Admin: Fetch everything
    List<Notice> findAllByOrderByCreatedAtDesc();

    // For Teacher: Fetch notices they posted to a specific class
    List<Notice> findByClassLevelAndDivisionOrderByCreatedAtDesc(Integer classLevel, String division);

    // FOR STUDENT: Magic query! Fetches their class notices OR Admin global notices (ClassLevel 0)
    @Query("SELECT n FROM Notice n WHERE (n.classLevel = :classLevel AND n.division = :division) OR (n.classLevel = 0 AND n.division = 'ALL') AND n.type != 'TEACHER_ONLY' ORDER BY n.createdAt DESC")
    List<Notice> findNoticesForStudent(@Param("classLevel") Integer classLevel, @Param("division") String division);
}