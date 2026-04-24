package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.Notice;
import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.repositories.NoticeRepository;
import com.e_learning.backend_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/notices")

public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. GET Notices for a specific class
    @GetMapping
    public ResponseEntity<List<Notice>> getClassNotices(
            @RequestParam Integer classLevel,
            @RequestParam String division) {

        // Add this to NoticeRepository: List<Notice> findByClassLevelAndDivisionOrderByCreatedAtDesc(...)
        List<Notice> notices = noticeRepository.findByClassLevelAndDivisionOrderByCreatedAtDesc(classLevel, division);
        return ResponseEntity.ok(notices);
    }

    // 2. POST a new Notice (With Optional File Upload)
    @PostMapping
    public ResponseEntity<?> createNotice(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("type") String type,
            @RequestParam("classLevel") Integer classLevel,
            @RequestParam("division") String division,
            @RequestParam("authorId") Long authorId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            Notice notice = new Notice();
            notice.setTitle(title);
            notice.setContent(content);
            notice.setType(type);
            notice.setClassLevel(classLevel);
            notice.setDivision(division);

            // Set the author
            User author = userRepository.findById(authorId).orElseThrow(() -> new RuntimeException("Teacher not found"));
            notice.setAuthor(author);

            // Handle the optional file
            if (file != null && !file.isEmpty()) {
                notice.setAttachmentName(file.getOriginalFilename());
                notice.setAttachmentType(file.getContentType());
                notice.setAttachmentData(file.getBytes());
            }

            Notice savedNotice = noticeRepository.save(notice);

            // Don't send the heavy byte array back to the frontend immediately to save bandwidth
            savedNotice.setAttachmentData(null);
            return ResponseEntity.ok(savedNotice);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create notice.");
        }
    }

    // 3. DELETE a notice
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        if (noticeRepository.existsById(id)) {
            noticeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}