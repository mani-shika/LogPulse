package com.manishika.loganalyzer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public GeminiAiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getAiSummary(String errorLogs) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        String promptText = "Act as a Senior DevOps Engineer. I have a filtered server log file containing only CRITICAL errors. " +
                    "1. Summarize what went wrong in one short paragraph. " +
                    "2. Write a copy-pasteable bash script to fix the server (use ```bash to format the code block). " +
                    "Here are the errors: " + errorLogs;

        String requestBody = """
                {
                  "contents": [{
                    "parts": [{"text": "%s"}]
                  }]
                }
                """.formatted(promptText.replace("\"", "\\\"").replace("\n", " "));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        int maxRetries = 3;
        int attempt = 0;
        long waitTime = 2000; // Start with a 2-second wait

        // EXPONENTIAL BACKOFF AND RETRY LOOP
        while (attempt < maxRetries) {
            try {
                // Try to hit the Google API
                ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
                return response.getBody(); 
                
            } catch (HttpServerErrorException e) {
                // Catch 503 Service Unavailable (and other 5xx server errors)
                attempt++;
                System.out.println("Google AI overloaded (" + e.getStatusCode() + "). Retrying attempt " + attempt + " of " + maxRetries);
                
                if (attempt >= maxRetries) {
                    return formatFallbackResponse("Google AI is currently experiencing extreme load. Attempted " + maxRetries + " retries. Please try again in a few minutes.");
                }
                
                try {
                    Thread.sleep(waitTime);
                    waitTime = waitTime * 2; // Double the wait time: 2s, then 4s, then 8s
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return formatFallbackResponse("Retry interrupted by system.");
                }
            } catch (Exception e) {
                // Catch any other unexpected errors immediately
                return formatFallbackResponse("Error communicating with Google AI: " + e.getMessage());
            }
        }
        
        return formatFallbackResponse("Failed to retrieve data after multiple attempts.");
    }

    // Helper method to wrap errors in the exact JSON format your React frontend expects
    private String formatFallbackResponse(String errorMessage) {
        return "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"" + errorMessage + "\"}]}}]}";
    }
}