package com.test.lms.controller;

import com.test.lms.dto.ApiResponse;
import com.test.lms.dto.CourseLearningDTO;
import com.test.lms.dto.StudentProgressDTO;
import com.test.lms.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ==============================================================================
 * STUDENT LMS PORTAL CONTROLLER
 * ==============================================================================
 * Dedicated student-facing endpoints for:
 * 1. Viewing enrolled courses with real-time completion progress.
 * 2. Accessing the interactive course learning room with structured activities.
 * 3. Marking activities/lessons/assignments as completed to advance progress.
 */
@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@Tag(name = "Student LMS Portal", description = "Endpoints for students to browse assigned courses, learn, and complete activities")
public class StudentController {

    private final StudentService studentService;

    /**
     * --------------------------------------------------------------------------
     * 1. GET STUDENT'S ENROLLED COURSES
     * --------------------------------------------------------------------------
     * HTTP Method: GET
     * URL: /api/v1/student/{studentId}/courses
     * Role: STUDENT
     * Purpose: Lists all courses assigned to this student, including their current
     * progress percentage, total activities, and completed activities count.
     */
    @GetMapping("/{studentId}/courses")
    @Operation(summary = "Get Enrolled Courses", description = "Returns all courses assigned to the student with overall completion percentages.")
    public ResponseEntity<ApiResponse<List<StudentProgressDTO>>> getEnrolledCourses(
            @Parameter(description = "ID of the logged-in student") @PathVariable Long studentId) {
        List<StudentProgressDTO> courses = studentService.getEnrolledCourses(studentId);
        return ResponseEntity.ok(ApiResponse.success(courses, "Retrieved " + courses.size() + " enrolled course(s)"));
    }

    /**
     * --------------------------------------------------------------------------
     * 2. ACCESS COURSE LEARNING ROOM
     * --------------------------------------------------------------------------
     * HTTP Method: GET
     * URL: /api/v1/student/{studentId}/courses/{courseId}
     * Role: STUDENT
     * Purpose: Opens the student LMS classroom for a specific course.
     * Delivers the course overview, syllabus of activities, content links/instructions,
     * and highlights which activities the student has completed vs pending.
     */
    @GetMapping("/{studentId}/courses/{courseId}")
    @Operation(summary = "Get Course Learning Room", description = "Loads course details and all activities with per-activity completion flags for the student.")
    public ResponseEntity<ApiResponse<CourseLearningDTO>> getCourseLearningRoom(
            @Parameter(description = "ID of the student") @PathVariable Long studentId,
            @Parameter(description = "ID of the enrolled course") @PathVariable Long courseId) {
        CourseLearningDTO learningRoom = studentService.getCourseLearningRoom(studentId, courseId);
        return ResponseEntity.ok(ApiResponse.success(learningRoom, "Learning room loaded successfully"));
    }

    /**
     * --------------------------------------------------------------------------
     * 3. COMPLETE AN ACTIVITY
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/student/{studentId}/activities/{activityId}/complete
     * Role: STUDENT
     * Purpose: Marks an activity (lecture, reading, quiz, or assignment) as completed.
     * Updates student progress in real-time. If all activities in the course are finished,
     * updates the enrollment status to COMPLETED.
     */
    @PostMapping("/{studentId}/activities/{activityId}/complete")
    @Operation(summary = "Mark Activity as Completed", description = "Student marks an activity as finished. Updates course completion percentage in real time.")
    public ResponseEntity<ApiResponse<Void>> completeActivity(
            @Parameter(description = "ID of the student") @PathVariable Long studentId,
            @Parameter(description = "ID of the activity being completed") @PathVariable Long activityId) {
        studentService.completeActivity(studentId, activityId);
        return ResponseEntity.ok(ApiResponse.success("Activity marked as completed"));
    }
}
