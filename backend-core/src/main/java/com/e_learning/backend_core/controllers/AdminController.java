package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.*;
import com.e_learning.backend_core.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows React to talk to Spring Boot!
public class AdminController {

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

    @PostMapping("/notices")
    public Notice publishNotice(@RequestBody Notice notice) {
        return noticeRepository.save(notice);
    }

    @GetMapping("/notices")
    public List<Notice> getRecentNotices() {
        return noticeRepository.findAll();
    }
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
}