package com.manishika.loganalyzer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    // The @Bean annotation tells Spring Boot: "Build this telephone once when the server starts, 
    // and keep it ready in memory for anyone who needs to make an internet call."
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}