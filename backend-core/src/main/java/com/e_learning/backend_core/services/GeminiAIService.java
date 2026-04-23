package com.e_learning.backend_core.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {

    // Add your API key in application.properties: gemini.api.key=YOUR_KEY_HERE
    @Value("${gemini.api.key}")
    private String apiKey;
    @Value("${gemini.model}")
    private String geminiModel;

    private final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

    private final String GEMINI_URL= BASE_URL + geminiModel + ":generateContent?key=" + apiKey;


    public String generateQuizJSON(String topicOrText) {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = "Based on the following topic or text, generate 5 multiple choice questions. " +
                "You MUST return ONLY a raw JSON array. Do not include markdown formatting like ```json. " +
                "Each object in the array must strictly have: " +
                "'id' (integer), 'question' (string), 'options' (array of 4 strings), and 'correct' (integer 0-3 representing the index of the correct option). " +
                "Topic/Text: " + topicOrText;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
                Map.of("parts", List.of(
                        Map.of("text", prompt)
                ))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(GEMINI_URL + apiKey, request, Map.class);

            // Extract the generated text from Gemini's specific JSON response structure
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            String jsonString = (String) parts.get(0).get("text");

            // Clean up any stray markdown if the AI includes it
            return jsonString.replace("```json", "").replace("```", "").trim();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    // --- NEW METHOD FOR THE AI TUTOR CHATBOT ---
    public String generateChatResponse(String systemPrompt) {
        RestTemplate restTemplate = new RestTemplate();

        // 1. Construct the request body for Gemini
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
                Map.of("parts", List.of(
                        Map.of("text", systemPrompt)
                ))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            // 2. Call the Gemini API
            Map<String, Object> response = restTemplate.postForObject(GEMINI_URL + apiKey, request, Map.class);

            // 3. Parse the nested JSON response to extract just the text
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            String aiResponseText = (String) parts.get(0).get("text");

            // Return the clean, conversational text back to the controller!
            return aiResponseText.trim();

        } catch (Exception e) {
            e.printStackTrace();
            return "I am having a little trouble connecting to my knowledge base right now. Let's try again in a minute!";
        }
    }
}