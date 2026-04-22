package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.DailySchedule;
import com.e_learning.backend_core.models.User;
import com.e_learning.backend_core.repositories.DailyScheduleRepository;
import com.e_learning.backend_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DailyScheduleRepository dailyScheduleRepository;

    // --- SECURE PASSWORD GENERATOR ---
    private String generateSecurePassword() {
        // Excluded confusing characters like 0, O, 1, I, l
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";
        SecureRandom rnd = new SecureRandom();
        StringBuilder sb = new StringBuilder(8); // 8 character password

        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // 1. GET Categorized Roster & Stats
    @GetMapping("/roster")
    public ResponseEntity<?> getClassRoster(@RequestParam Integer classLevel, @RequestParam String division) {
        List<User> students = userRepository.findByRoleAndClassLevelAndDivision(User.Role.STUDENT, classLevel, division);
        return ResponseEntity.ok(students);
    }

    // 2. POST Save New Student (UPDATED FOR SECURITY)
    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody User student) {
        try {
            student.setRole(User.Role.STUDENT);
            student.setStatus("active");

            // Generate a truly random, secure password
            String securePwd = generateSecurePassword();
            student.setPasswordHash(securePwd);

            User saved = userRepository.save(student);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Email or Mobile already exists.");
        }
    }

    // 3. PUT Edit Existing Student
    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody User updatedData) {
        return userRepository.findById(id).map(existingStudent -> {
            existingStudent.setFullName(updatedData.getFullName());
            existingStudent.setRollNo(updatedData.getRollNo());
            existingStudent.setGender(updatedData.getGender());
            existingStudent.setParentMobileNo(updatedData.getParentMobileNo());
            existingStudent.setMobileNo(updatedData.getParentMobileNo());

            User saved = userRepository.save(existingStudent);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. DELETE Student
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 5. GET Today's Schedule
    @GetMapping("/schedule")
    public ResponseEntity<List<DailySchedule>> getTodaysSchedule(@RequestParam Long teacherId) {
        // Only fetch records where the date matches TODAY
        List<DailySchedule> todaysClasses = dailyScheduleRepository.findByTeacherIdAndDateOrderByStartTimeAsc(teacherId, LocalDate.now());
        return ResponseEntity.ok(todaysClasses);
    }

    // 6. POST Add Period to Today's Schedule
    @PostMapping("/schedule")
    public ResponseEntity<?> addSchedulePeriod(@RequestBody DailySchedule schedule, @RequestParam Long teacherId) {
        try {
            User teacher = userRepository.findById(teacherId).orElseThrow();
            schedule.setTeacher(teacher);

            // Automatically stamp this record with TODAY'S date
            schedule.setDate(LocalDate.now());

            DailySchedule saved = dailyScheduleRepository.save(schedule);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to save schedule period.");
        }
    }
    @PostMapping("/schedule/import")
    public ResponseEntity<?> importScheduleFromImage(
            @RequestParam("teacherId") Long teacherId,
            @RequestParam("file") MultipartFile file) {

        try {
            User teacher = userRepository.findById(teacherId).orElseThrow();

            // 1. Convert MultipartFile to Base64 or pass to Cloud Storage

            // 2. Call your OCR/AI Service (e.g., Gemini API)
            // String prompt = "Analyze this timetable image. Extract the periods for today. Return ONLY a JSON array with startTime, endTime, subject, classLevel, division, and room.";
            // String jsonResult = geminiApiService.analyzeImage(file, prompt);

            // 3. Parse the JSON result into DailySchedule objects
            // List<DailySchedule> parsedSchedules = objectMapper.readValue(jsonResult, new TypeReference<List<DailySchedule>>(){});

            // 4. Save to Database
            // for(DailySchedule schedule : parsedSchedules) {
            //      schedule.setTeacher(teacher);
            //      schedule.setDate(LocalDate.now());
            //      dailyScheduleRepository.save(schedule);
            // }

            // 5. Return the saved list back to React
            // return ResponseEntity.ok(parsedSchedules);

            return ResponseEntity.ok("Smart Import Endpoint Reached");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to parse image.");
        }
    }
}