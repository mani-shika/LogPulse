package com.manishika.loganalyzer.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LogProcessingService {

    public String processLogFile(MultipartFile file) {
        List<String> errorLines = new ArrayList<>();

        // We use try-with-resources here so Java automatically closes the file when it's done, preventing memory leaks.
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            
            // This loop reads ONE line at a time. It never loads the whole 500MB file into RAM.
            while ((line = reader.readLine()) != null) {
                
                // The Filter: If the line contains an error, save it. Otherwise, throw it away.
                if (line.contains("[ERROR]") || line.contains("[FATAL]") || line.contains("Exception")) {
                    errorLines.add(line.trim());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to read the log file.", e);
        }

        // If the file was clean, let the user know.
        if (errorLines.isEmpty()) {
            return "No critical errors found in this log file.";
        }

        // Combine all the saved error lines into one single text block to send to the AI later.
        return String.join("\n", errorLines);
    }
}