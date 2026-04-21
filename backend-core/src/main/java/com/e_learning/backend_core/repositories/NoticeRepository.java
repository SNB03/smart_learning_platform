package com.e_learning.backend_core.repositories;


import com.e_learning.backend_core.models.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface NoticeRepository extends JpaRepository<Notice,Long> {
    Notice save(Notice notice);
    List<Notice> findAll();

    List<Notice> findByClassLevelAndDivisionOrderByCreatedAtDesc(Integer classLevel, String division);

}
