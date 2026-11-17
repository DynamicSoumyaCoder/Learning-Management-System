package com.test.lms.controller;

import com.test.lms.dto.*;
import com.test.lms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ==============================================================================
 * AUTHENTICATION CONTROLLER
 * ==============================================================================
 * Manages user authentication, instructor registration, and first-login password updates.
 * Accessible to both Instructors and Students.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Onboarding", description = "Endpoints for user login, instructor registration, and student first-login password changes")
public class AuthController {

    private final AuthService authService;

    /**
     * --------------------------------------------------------------------------
     * 1. USER LOGIN (INSTRUCTOR & STUDENT)
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/auth/login
     * Purpose: Authenticates either an Instructor or a Student using email and password.
     * Returns: User identity, assigned Role (INSTRUCTOR / STUDENT), and isFirstLogin flag.
     * If isFirstLogin is true (for newly added students), the frontend prompts for password change.
     */
    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates an Instructor or Student with email and password.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid credentials or validation error")
    })
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Valid @RequestBody AuthRequestDTO requestDTO) {
        AuthResponseDTO response = authService.login(requestDTO);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    /**
     * --------------------------------------------------------------------------
     * 2. REGISTER INSTRUCTOR
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/auth/register-instructor
     * Purpose: Creates an initial or new Instructor account with chosen credentials.
     * Returns: Registered instructor profile and active auth session token.
     */
    @PostMapping("/register-instructor")
    @Operation(summary = "Register Instructor", description = "Allows creation of a new instructor account.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Instructor registered successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input payload"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Email already registered")
    })
    public ResponseEntity<ApiResponse<AuthResponseDTO>> registerInstructor(
            @Valid @RequestBody RegisterInstructorDTO requestDTO) {
        AuthResponseDTO response = authService.registerInstructor(requestDTO);
        return new ResponseEntity<>(
                ApiResponse.success(response, "Instructor registered successfully"),
                HttpStatus.CREATED
        );
    }

    /**
     * --------------------------------------------------------------------------
     * 3. STUDENT FIRST-LOGIN PASSWORD CHANGE
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/auth/change-password
     * Purpose: When a student logs in for the first time using the default instructor-provided
     * password, this endpoint updates the password to their personal password and resets isFirstLogin to false.
     */
    @PostMapping("/change-password")
    @Operation(summary = "Change Password", description = "Sets a new personal password for a student upon first login.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Password updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Old password mismatch or invalid new password"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordDTO requestDTO) {
        authService.changePassword(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully. You may now continue using your account."));
    }
}
