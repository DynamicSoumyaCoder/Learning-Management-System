package com.test.lms.controller;

import com.test.lms.dto.*;
import com.test.lms.service.InstructorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ==============================================================================
 * INSTRUCTOR CONTROLLER
 * ==============================================================================
 * Dedicated endpoints for Instructors:
 * 1. Adding students with default credentials and profile details.
 * 2. Assigning students to courses (enrollment).
 * 3. Viewing comprehensive student progress across courses on the dashboard.
 */
@RestController
@RequestMapping("/api/v1/instructor")
@RequiredArgsConstructor
@Tag(name = "Instructor Operations", description = "Endpoints for student management, course enrollment, and progress monitoring")
public class InstructorController {

    private final InstructorService instructorService;

    /**
     * --------------------------------------------------------------------------
     * 1. ADD NEW STUDENT (WITH DEFAULT PASSWORD)
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/instructor/students
     * Role: INSTRUCTOR
     * Purpose: Instructor adds a student with name, email, phone, optional bio,
     * and a default temporary password. Sets isFirstLogin = true.
     */
    @PostMapping("/students")
    @Operation(summary = "Add New Student", description = "Instructor registers a student with contact information and an initial default password.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Student added successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation failed for fields"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Student email already registered")
    })
    public ResponseEntity<ApiResponse<StudentResponseDTO>> addStudent(
            @Valid @RequestBody StudentCreateDTO requestDTO) {
        StudentResponseDTO student = instructorService.addStudent(requestDTO);
        return new ResponseEntity<>(
                ApiResponse.success(student, "Student created successfully with temporary credentials"),
                HttpStatus.CREATED
        );
    }

    /**
     * --------------------------------------------------------------------------
     * 2. GET ALL STUDENTS
     * --------------------------------------------------------------------------
     * HTTP Method: GET
     * URL: /api/v1/instructor/students
     * Role: INSTRUCTOR
     * Purpose: Lists all registered students in the LMS.
     */
    @GetMapping("/students")
    @Operation(summary = "Get All Students", description = "Fetches a list of all students managed by the system.")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getAllStudents() {
        List<StudentResponseDTO> students = instructorService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success(students, "Retrieved " + students.size() + " student(s)"));
    }

    /**
     * --------------------------------------------------------------------------
     * 3. ASSIGN / ENROLL STUDENT TO COURSE
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/instructor/enroll
     * Role: INSTRUCTOR
     * Purpose: Enrolls a student in a specific course so they can access activities and track progress.
     */
    @PostMapping("/enroll")
    @Operation(summary = "Enroll Student in Course", description = "Assigns a student to a designated course.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Student enrolled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Student or Course not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Student already enrolled")
    })
    public ResponseEntity<ApiResponse<Void>> enrollStudent(
            @Valid @RequestBody EnrollmentRequestDTO requestDTO) {
        instructorService.enrollStudent(requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Student successfully enrolled in course"));
    }

    /**
     * --------------------------------------------------------------------------
     * 4. REMOVE STUDENT ENROLLMENT
     * --------------------------------------------------------------------------
     * HTTP Method: DELETE
     * URL: /api/v1/instructor/enroll
     * Role: INSTRUCTOR
     * Purpose: Unenrolls a student from a course.
     */
    @DeleteMapping("/enroll")
    @Operation(summary = "Unenroll Student", description = "Removes a student's enrollment from a course.")
    public ResponseEntity<ApiResponse<Void>> unenrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        instructorService.unenrollStudent(studentId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Student unenrolled successfully"));
    }

    /**
     * --------------------------------------------------------------------------
     * 5. INSTRUCTOR DASHBOARD: STUDENT PROGRESS MONITORING
     * --------------------------------------------------------------------------
     * HTTP Method: GET
     * URL: /api/v1/instructor/dashboard/progress
     * Role: INSTRUCTOR
     * Purpose: Returns a consolidated progress overview for all students across their enrolled
     * courses, showing completed activities vs total activities and progress percentage.
     */
    @GetMapping("/dashboard/progress")
    @Operation(summary = "Instructor Progress Dashboard", description = "Returns student progress across enrolled courses, activity counts, and completion percentages.")
    public ResponseEntity<ApiResponse<List<StudentProgressDTO>>> getProgressDashboard(
            @Parameter(description = "Optional instructor ID filter")
            @RequestParam(required = false) Long instructorId) {
        List<StudentProgressDTO> progress = instructorService.getInstructorDashboardProgress(instructorId);
        return ResponseEntity.ok(ApiResponse.success(progress, "Retrieved progress for " + progress.size() + " enrollment(s)"));
    }
}
