package com.e_learning.backend_core.controllers;

import com.e_learning.backend_core.services.GeminiAIService;
import com.e_learning.backend_core.services.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/teacher/quizzes")

public class QuizController {

    @Autowired
    private GeminiAIService aiService;

    @Autowired
    private PdfService pdfService; // Inject our new PDF parser

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(
            @RequestParam(value = "prompt", required = false) String prompt,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            String textContext = "";

            // 1. Check if a file was uploaded
            if (file != null && !file.isEmpty()) {
                String contentType = file.getContentType();

                // If it's a PDF, extract the text!
                if ("application/pdf".equals(contentType)) {
                    textContext = pdfService.extractTextFromPdf(file);
                }
                // If it's just a plain text file
                else if ("text/plain".equals(contentType)) {
                    textContext = new String(file.getBytes());
                } else {
                    return ResponseEntity.badRequest().body("Unsupported file type. Please upload a PDF or TXT file.");
                }
            }
            // 2. If no file, use the text prompt
            else if (prompt != null && !prompt.trim().isEmpty()) {
                textContext = prompt;
            }
            else {
                return ResponseEntity.badRequest().body("Must provide either a prompt or a file.");
            }

            // 3. Call the AI Service with the extracted text
            String generatedJsonArray = aiService.generateQuizJSON(textContext);

            if (generatedJsonArray == null || generatedJsonArray.isEmpty()) {
                return ResponseEntity.internalServerError().body("AI generation failed or returned empty.");
            }

            // 4. Return the raw JSON string back to React
            return ResponseEntity.ok(generatedJsonArray);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to process request: " + e.getMessage());
        }
    }
}