package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.models.DailySchedule;
import com.e_learning.backend_core.models.Notice;
import com.e_learning.backend_core.models.Quiz;
import com.e_learning.backend_core.models.StudyMaterial;
import com.e_learning.backend_core.repositories.DailyScheduleRepository;
import com.e_learning.backend_core.repositories.NoticeRepository;
import com.e_learning.backend_core.repositories.QuizRepository;
import com.e_learning.backend_core.repositories.StudyMaterialRepository;
import com.e_learning.backend_core.services.GeminiAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")

public class StudentController {

    @Autowired
    private DailyScheduleRepository scheduleRepository;
    // Add this Autowired service
    @Autowired
    private GeminiAIService aiService;
    @Autowired
    private NoticeRepository noticeRepository;
@Autowired
    private QuizRepository quizRepository;
    @Autowired
    private StudyMaterialRepository materialRepository;

    // 1. GET Today's Schedule for the Student's Class
    @GetMapping("/schedule")
    public ResponseEntity<List<DailySchedule>> getTodaySchedule(@RequestParam Integer classLevel, @RequestParam String division) {
        List<DailySchedule> schedule = scheduleRepository.findByClassLevelAndDivisionAndDateOrderByStartTimeAsc(classLevel, division, LocalDate.now());
        return ResponseEntity.ok(schedule);
    }

    // 2. GET Notices for the Student's Class
    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getClassNotices(@RequestParam Integer classLevel, @RequestParam String division) {
        List<Notice> notices = noticeRepository.findByClassLevelAndDivisionOrderByCreatedAtDesc(classLevel, division);
        return ResponseEntity.ok(notices);
    }

    // 3. GET Study Materials for the Student's ClassLevel
    @GetMapping("/materials")
    public ResponseEntity<List<StudyMaterial>> getClassMaterials(@RequestParam Integer classLevel) {
        // Fetch all materials, then filter by classLevel (In production, you'd add this query to the repository directly)
        List<StudyMaterial> materials = materialRepository.findAll()
                .stream()
                .filter(m -> m.getClassLevel().equals(classLevel))
                .collect(Collectors.toList());

        // Strip heavy file data before sending to dashboard feed
        materials.forEach(m -> m.setFileData(null));
        return ResponseEntity.ok(materials);
    }
    // Add this endpoint class definition
    public static class ChatRequest {
        public String question;
        public Integer classLevel;
    }



    // 4. POST Ask AI Tutor
    @PostMapping("/ai/ask")
    public ResponseEntity<String> askAITutor(@RequestBody ChatRequest request) {
        try {
            // Give the AI its "persona" before sending the student's question
            String personaPrompt = "You are a friendly, encouraging school tutor. " +
                    "You are talking to a student in Class " + request.classLevel + ". " +
                    "Keep your answer to 2-3 short paragraphs, use simple analogies suitable for their age, and DO NOT use markdown formatting like asterisks or bold tags. " +
                    "The student's question is: " + request.question;

            String aiResponse = aiService.generateChatResponse(personaPrompt);

            return ResponseEntity.ok(aiResponse);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to get AI response.");
        }
    }
    // Define the incoming JSON structure
    public static class QuizSubmission {
        public Long quizId;
        public Long studentId;
        public Map<Long, String> submittedAnswers; // Key: Question ID, Value: Student's Answer Text
    }

    @PostMapping("/quizzes/submit")
    public ResponseEntity<?> gradeQuizWithAI(@RequestBody QuizSubmission submission) {
        try {
            // 1. Fetch the actual Quiz and correct answers from DB
            // Quiz quiz = quizRepository.findById(submission.quizId).orElseThrow();

            // --- MOCK GRADING LOGIC FOR EXAMPLE ---
            int correctCount = 0;
            int totalQuestions = submission.submittedAnswers.size();
            List<Map<String, Object>> gradedQuestions = new ArrayList<>();

            for (Map.Entry<Long, String> entry : submission.submittedAnswers.entrySet()) {
                Long questionId = entry.getKey();
                String studentAns = entry.getValue();

                // Assume we fetched the correct answer from the DB
                String correctAns = "Mitochondria"; // Mock correct answer
                String questionText = "What is the powerhouse of the cell?"; // Mock text

                boolean isCorrect = studentAns.equalsIgnoreCase(correctAns);
                if (isCorrect) correctCount++;

                Map<String, Object> gradedQ = new HashMap<>();
                gradedQ.put("id", questionId);
                gradedQ.put("question", questionText);
                gradedQ.put("studentAnswer", studentAns);
                gradedQ.put("correctAnswer", correctAns);
                gradedQ.put("isCorrect", isCorrect);

                // 2. THE AI EXPLANATION LOGIC
                if (!isCorrect) {
                    String aiPrompt = "A student answered a quiz question incorrectly. " +
                            "Question: '" + questionText + "'. " +
                            "They answered: '" + studentAns + "'. " +
                            "The correct answer is: '" + correctAns + "'. " +
                            "Write a short, encouraging 2-sentence explanation tailored for a middle school student explaining WHY their answer is wrong and why the correct answer is right.";

                    // Call Gemini!
                    String explanation = aiService.generateChatResponse(aiPrompt);
                    gradedQ.put("aiExplanation", explanation);
                }

                gradedQuestions.add(gradedQ);
            }

            // 3. Package the final results
            Map<String, Object> finalResult = new HashMap<>();
            finalResult.put("score", correctCount);
            finalResult.put("total", totalQuestions);
            finalResult.put("percentage", Math.round(((float) correctCount / totalQuestions) * 100));
            finalResult.put("questions", gradedQuestions);

            return ResponseEntity.ok(finalResult);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Grading failed.");
        }
    }
    @GetMapping("/notices/{id}/download")
    public ResponseEntity<byte[]> downloadNoticeAttachment(@PathVariable Long id) {
        try {
            // 1. Fetch the notice from the database
            Notice notice = noticeRepository.findById(id).orElseThrow(() -> new RuntimeException("Notice not found"));

            // 2. Extract the file data and name
            byte[] fileData = notice.getAttachmentData(); // Assuming you have this field
            String fileName = notice.getAttachmentName();

            if (fileData == null) {
                return ResponseEntity.notFound().build();
            }

            // 3. Set the headers to tell the browser "This is a file download"
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileName);

            // 4. Return the file!
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileData);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    // 5. GET Download Study Material File
    @GetMapping("/materials/{id}/download")
    public ResponseEntity<byte[]> downloadStudyMaterial(@PathVariable Long id) {
        try {
            // 1. Fetch the material from the database
            // Note: Make sure your materialRepository is Autowired at the top!
            StudyMaterial material = materialRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Material not found"));

            // 2. Extract the file data
            byte[] fileData = material.getFileData(); // The raw file bytes stored in DB
            String fileName = material.getTitle() + ".pdf"; // Fallback name if you don't store filenames

            if (fileData == null) {
                return ResponseEntity.notFound().build();
            }

            // 3. Set headers to trigger a download in the browser
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF); // Assumes PDFs for materials
            headers.setContentDispositionFormData("attachment", fileName);

            // 4. Return the file bytes
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileData);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    // 6. GET Quizzes for the Student's Class
    // 6. GET Quizzes for the Student's Class
    @GetMapping("/quizzes")
    public ResponseEntity<?> getClassQuizzes(@RequestParam Integer classLevel) {
        try {
            // 1. Fetch REAL quizzes assigned to this class level from MySQL
            List<Quiz> quizzes = quizRepository.findByClassLevelOrderByCreatedAtDesc(classLevel);

            // 2. Map the DB entities to the exact JSON structure React expects
            List<Map<String, Object>> responseList = new ArrayList<>();

            for (Quiz q : quizzes) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", q.getId());
                map.put("title", q.getTitle());
                map.put("subject", q.getSubject());
                map.put("timeLimit", q.getTimeLimit());
                map.put("dueDate", q.getDueDate());
                // In a production app, you would check a "StudentQuizResults" table to see if it's completed
                map.put("status", "pending");
                responseList.add(map);
            }

            // 3. Fallback: If no real quizzes exist in the DB yet, show the mock ones for UI testing
            if (responseList.isEmpty()) {
                List<Map<String, Object>> mockQuizzes = List.of(
                        Map.of("id", 101, "title", "Science Mid-Term: Cell Biology", "subject", "Science", "timeLimit", 15, "status", "pending", "dueDate", "Tomorrow", "questionCount", 5),
                        Map.of("id", 102, "title", "Fractions Mini-Quiz", "subject", "Mathematics", "timeLimit", 10, "status", "completed", "score", 4, "percentage", 80, "questionCount", 5)
                );
                return ResponseEntity.ok(mockQuizzes);
            }

            // Return the real database quizzes!
            return ResponseEntity.ok(responseList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    // 7. POST Upload Profile Photo
    @PostMapping("/profile/photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @RequestParam("studentId") Long studentId,
            @RequestParam("photo") MultipartFile photo) {
        try {
            // In a real app, you would save this to your database or an S3 bucket:
            // byte[] photoBytes = photo.getBytes();
            // studentRepository.updateProfilePhoto(studentId, photoBytes);

            return ResponseEntity.ok(Map.of("message", "Profile photo updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload photo.");
        }
    }

    // 8. GET Fetch Student Stats (Attendance & Progress)
    @GetMapping("/profile/stats")
    public ResponseEntity<?> getStudentStats(@RequestParam Long studentId) {
        try {
            // MOCK RESPONSE: You would normally calculate this from your database tables
            Map<String, Object> stats = Map.of(
                    "attendance", Map.of("percentage", 92, "present", 46, "total", 50),
                    "progress", List.of(
                            Map.of("subject", "Mathematics", "score", 85, "color", "bg-blue-500"),
                            Map.of("subject", "Science", "score", 92, "color", "bg-emerald-500"),
                            Map.of("subject", "English", "score", 78, "color", "bg-purple-500")
                    )
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 9. GET Download Report Card
    @GetMapping("/profile/report-card/download")
    public ResponseEntity<byte[]> downloadReportCard(@RequestParam Long studentId) {
        try {
            // In a real app, you would generate a PDF here using a library like iText or JasperReports
            byte[] dummyPdfData = "This is a dummy PDF payload for the Report Card".getBytes();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Report_Card_" + studentId + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(dummyPdfData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    // 10. GET Student Achievements
    @GetMapping("/profile/achievements")
    public ResponseEntity<?> getStudentAchievements(@RequestParam Long studentId) {
        try {
            // In a real app, you query the database for badges earned by this student ID
            List<Map<String, Object>> achievements = List.of(
                    Map.of("id", 1, "type", "STREAK", "title", "7-Day Streak", "description", "Logged in for 7 consecutive days!"),
                    Map.of("id", 2, "type", "TOP_SCORE", "title", "Top Scorer", "description", "Highest score in Science Mid-Term")
            );
            return ResponseEntity.ok(achievements);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 11. GET Student Recent Activity
    @GetMapping("/profile/activity")
    public ResponseEntity<?> getStudentActivity(@RequestParam Long studentId) {
        try {
            // Query the last 5 actions the student took in the system
            List<Map<String, Object>> activities = List.of(
                    Map.of("id", 1, "type", "QUIZ", "action", "Completed Quiz", "target", "Science Mid-Term", "time", "2 hours ago"),
                    Map.of("id", 2, "type", "VIDEO", "action", "Watched Lecture", "target", "Cell Structure Video", "time", "Yesterday"),
                    Map.of("id", 3, "type", "DOWNLOAD", "action", "Downloaded", "target", "Algebra Formula Sheet", "time", "2 days ago")
            );
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}