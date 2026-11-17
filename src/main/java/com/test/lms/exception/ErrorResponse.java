package com.test.lms.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard structured error response returned by GlobalExceptionHandler.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Structured error payload returned upon failures")
public class ErrorResponse {

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "High-level error classification", example = "Bad Request")
    private String error;

    @Schema(description = "Detailed human-readable message", example = "Validation failed for one or more fields")
    private String message;

    @Schema(description = "List of specific field validation errors (if any)")
    private List<String> details;

    @Schema(description = "URI path of the request that caused the error", example = "/api/v1/courses")
    private String path;

    @Schema(description = "Timestamp when error occurred")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
