package com.test.lms.controller;

import com.test.lms.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Health & Test Controller.
 * Provides lightweight endpoints to verify that the backend application is running.
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Health & Status", description = "Endpoints for checking system health and connectivity")
public class HealthController {

    @GetMapping("/test")
    @Operation(summary = "Simple test endpoint", description = "Returns a quick confirmation that the backend service is up and responding.")
    public ResponseEntity<ApiResponse<String>> test() {
        return ResponseEntity.ok(ApiResponse.success("Spring Boot LMS Backend is up and running successfully!"));
    }

    @GetMapping("/health")
    @Operation(summary = "Detailed health status", description = "Returns system metadata, current timestamp, and service status.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> healthInfo = Map.of(
                "status", "UP",
                "service", "lms-backend",
                "environment", "development",
                "serverTime", LocalDateTime.now().toString(),
                "javaVersion", System.getProperty("java.version")
        );
        return ResponseEntity.ok(ApiResponse.success(healthInfo, "System health is optimal"));
    }
}
