package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.*;
import com.e_learning.backend_core.repositories.*;
import com.e_learning.backend_core.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows React to talk to Spring Boot!
public class AdminController {
    @Autowired
    private AdminService adminService; // Inject the new service
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NoticeRepository noticeRepository;

    // --- TEACHER ENDPOINTS ---



    @GetMapping("/teachers")
    public List<User> getAllTeachers() {
        return userRepository.findByRole(User.Role.TEACHER); // Ensure this method exists in your UserRepository
    }

    // --- NOTICE ENDPOINTS ---

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();

        // Count teachers
        long teacherCount = userRepository.countByRole(User.Role.TEACHER);

        // Count students (Assuming you have a STUDENT role)
        // If you haven't added students yet, this will safely return 0
        long studentCount = userRepository.countByRole(User.Role.STUDENT);

        // Count total active notices
        long noticeCount = noticeRepository.count();

        stats.put("activeTeachers", teacherCount);
        stats.put("totalStudents", studentCount);
        stats.put("activeNotices", noticeCount);

        return stats;
    }
    // 1. GET all teachers for the directory


    // 2. DELETE a teacher
    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 3. TOGGLE teacher status (Active/Inactive)
    // Note: Add a 'status' string field (default "active") to your User entity if you haven't!
    @PutMapping("/teachers/{id}/status")
    public ResponseEntity<?> toggleTeacherStatus(@PathVariable Long id) {
        return userRepository.findById(id).map(teacher -> {
            String newStatus = "active".equals(teacher.getStatus()) ? "inactive" : "active";
            teacher.setStatus(newStatus);
            userRepository.save(teacher);
            return ResponseEntity.ok(teacher);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/teachers")
    public ResponseEntity<?> createTeacher(@RequestBody User newTeacher) {
        try {
            // 1. Generate Secure Password
            String generatedPassword = newTeacher.getFullName().split(" ")[0].toLowerCase()
                    + (int)(Math.random() * 9000 + 1000);
            newTeacher.setPasswordHash(generatedPassword);
            newTeacher.setRole(User.Role.TEACHER);
            newTeacher.setStatus("active");

            // 2. Link the dynamic assignments properly
            if (newTeacher.getAssignments() != null) {
                for (TeacherAssignment assignment : newTeacher.getAssignments()) {
                    assignment.setTeacher(newTeacher);
                }
            }

            User savedTeacher = userRepository.save(newTeacher);
            return ResponseEntity.ok(savedTeacher);

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Error: Email or Mobile Number already exists!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while saving the teacher.");
        }
    }

    // --- BULK UPLOAD TEACHERS ---
    @PostMapping("/teachers/bulk-upload")
    public ResponseEntity<?> uploadTeachersCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a valid CSV file.");
        }

        List<User> savedTeachers = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstRow = true;

            while ((line = br.readLine()) != null) {
                if (isFirstRow) {
                    isFirstRow = false;
                    continue; // Skip header
                }

                String[] data = line.split(",");

                if (data.length < 7) {
                    failCount++;
                    continue;
                }

                try {
                    User teacher = new User();
                    teacher.setFullName(data[0].trim());
                    teacher.setEmail(data[1].trim());
                    teacher.setMobileNo(data[2].trim());
                    teacher.setRole(User.Role.TEACHER);
                    teacher.setStatus("active");

                    // NEW: Save the Teacher Type (Class vs Subject)
                    String roleType = data[3].trim().toLowerCase();
                    teacher.setTeacherType(roleType);

                    // Generate Password
                    String generatedPassword = teacher.getFullName().split(" ")[0].toLowerCase() + (int)(Math.random() * 9000 + 1000);
                    teacher.setPasswordHash(generatedPassword);

                    String[] classes = data[4].split(";");
                    String[] divisions = data[5].split(";");
                    String subjects = data[6].trim();

                    // Create Assignments
                    List<TeacherAssignment> assignments = new ArrayList<>();
                    for (String cls : classes) {
                        for (String div : divisions) {
                            TeacherAssignment assignment = new TeacherAssignment();
                            assignment.setClassLevel(Integer.parseInt(cls.trim()));
                            assignment.setDivision(div.trim());
                            assignment.setSubjectName(subjects);
                            assignment.setTeacher(teacher);
                            assignments.add(assignment);
                        }
                    }
                    teacher.setAssignments(assignments);

                    savedTeachers.add(userRepository.save(teacher));
                    successCount++;

                } catch (DataIntegrityViolationException e) {
                    failCount++; // Duplicate email/mobile in CSV
                } catch (Exception e) {
                    failCount++; // Bad formatting in CSV
                }
            }

            return ResponseEntity.ok("Successfully imported " + successCount + " teachers. Failed rows (Duplicates/Errors): " + failCount);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to process CSV file.");
        }
    }
    // 4. UPDATE a teacher's assignments
    @PutMapping("/teachers/{id}")
    public ResponseEntity<?> updateTeacherAssignments(@PathVariable Long id, @RequestBody User updatedData) {
        return userRepository.findById(id).map(existingTeacher -> {

            // 1. Clear the old assignments
            existingTeacher.getAssignments().clear();

            // 2. Add the newly configured assignments
            if (updatedData.getAssignments() != null) {
                for (TeacherAssignment newAssignment : updatedData.getAssignments()) {
                    newAssignment.setTeacher(existingTeacher);
                    existingTeacher.getAssignments().add(newAssignment);
                }
            }

            // 3. Save and return the updated teacher
            User savedTeacher = userRepository.save(existingTeacher);
            return ResponseEntity.ok(savedTeacher);

        }).orElse(ResponseEntity.notFound().build());
    }


    // GET Student Demographics & Stats (REAL DATA)
    @GetMapping("/student-stats")
    public ResponseEntity<?> getStudentStats() {
        try {
            // Call the service to crunch the numbers
            List<Map<String, Object>> stats = adminService.generateStudentDemographics();

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    // 1. GET ALL NOTICES (Real DB Query)
    @GetMapping("/notices")
    public ResponseEntity<?> getNotices() {
        try {
            List<Notice> notices = noticeRepository.findAllByOrderByCreatedAtDesc();
            List<Map<String, Object>> response = new ArrayList<>();

            for (Notice n : notices) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", n.getId());
                map.put("title", n.getTitle());
                map.put("content", n.getContent());
                // Map your DB 'type' or 'classLevel' logic to the UI 'audience' format
                map.put("audience", "TEACHER_ONLY".equals(n.getType()) ? "TEACHERS" : "ALL");
                map.put("attachmentName", n.getAttachmentName());
                map.put("datePublished", n.getCreatedAt() != null ? n.getCreatedAt() : LocalDateTime.now());
                response.add(map);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 2. POST NEW NOTICE (Saves File to MySQL)
    @PostMapping(value = "/notices", consumes = "multipart/form-data")
    public ResponseEntity<?> createNotice(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("audience") String audience,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Notice notice = new Notice();
            notice.setTitle(title);
            notice.setContent(content);
            notice.setType(audience.equals("TEACHERS") ? "TEACHER_ONLY" : "GENERAL");
            notice.setClassLevel(0); // 0 means 'All Classes' in this context
            notice.setDivision("ALL");
            notice.setCreatedAt(LocalDateTime.now());

            // NOTE: In a real app, you'd fetch the logged-in Admin User entity here
            User adminUser = userRepository.findById(1L).orElseThrow(() -> new RuntimeException("Admin not found"));
             notice.setAuthor(adminUser);

            // Handle the File Attachment
            if (file != null && !file.isEmpty()) {
                notice.setAttachmentName(file.getOriginalFilename());
                notice.setAttachmentType(file.getContentType());
                notice.setAttachmentData(file.getBytes()); // Saves the file payload to LONGBLOB
            }

            Notice savedNotice = noticeRepository.save(notice);

            // Return mapped response to React
            Map<String, Object> responseMap = Map.of(
                    "id", savedNotice.getId(),
                    "title", savedNotice.getTitle(),
                    "content", savedNotice.getContent(),
                    "audience", audience,
                    "attachmentName", savedNotice.getAttachmentName() == null ? "" : savedNotice.getAttachmentName(),
                    "datePublished", savedNotice.getCreatedAt()
            );

            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to save notice.");
        }
    }

    // 3. GET DOWNLOAD ATTACHMENT
    @GetMapping("/notices/{id}/download")
    public ResponseEntity<byte[]> downloadNoticeAttachment(@PathVariable Long id) {
        try {
            Notice notice = noticeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Notice not found"));

            if (notice.getAttachmentData() == null) {
                return ResponseEntity.notFound().build();
            }

            HttpHeaders headers = new HttpHeaders();
            // Try to set correct content type, fallback to generic binary stream
            headers.setContentType(MediaType.parseMediaType(
                    notice.getAttachmentType() != null ? notice.getAttachmentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE
            ));
            headers.setContentDispositionFormData("attachment", notice.getAttachmentName());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(notice.getAttachmentData());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}