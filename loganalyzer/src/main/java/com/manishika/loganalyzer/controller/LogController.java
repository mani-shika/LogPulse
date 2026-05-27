package com.manishika.loganalyzer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.manishika.loganalyzer.service.GeminiAiService;
import com.manishika.loganalyzer.service.LogProcessingService;

@RestController
@RequestMapping("/api/v1/logs")
public class LogController {

    private final LogProcessingService logService;
    private final GeminiAiService aiService;

    // Injecting both the Chef and the Communicator
    public LogController(LogProcessingService logService, GeminiAiService aiService) {
        this.logService = logService;
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeLog(@RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: You did not attach a file.");
        }

        // 1. The Waiter hands the file to the Chef to filter out the garbage
        String filteredErrors = logService.processLogFile(file);
        
        // If the file was clean, stop here and tell the user.
        if (filteredErrors.startsWith("No critical errors")) {
            return ResponseEntity.ok(filteredErrors);
        }

        // 2. The Waiter hands the filtered errors to the Communicator to get the AI Summary
        String aiSummary = aiService.getAiSummary(filteredErrors);
        
        // 3. Return the AI's final answer!
        return ResponseEntity.ok(aiSummary);
    }
}