package com.test.lms.controller;

import com.test.lms.dto.*;
import com.test.lms.service.CourseService;
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
 * COURSE & ACTIVITY MANAGEMENT CONTROLLER
 * ==============================================================================
 * Manages full lifecycle of Courses and Course Activities:
 * - Creating courses with name and total hours
 * - Managing activities (video, reading, assignments, quizzes) within a course
 * - Editing and deleting course structures
 */
@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Tag(name = "Courses & Activities", description = "Course and activity creation, updates, and management")
public class CourseController {

    private final CourseService courseService;

    /**
     * --------------------------------------------------------------------------
     * 1. CREATE COURSE
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/courses
     * Role: INSTRUCTOR
     * Purpose: Creates a new course specifying course name, duration in hours,
     * category, description, and instructor identifier.
     */
    @PostMapping
    @Operation(summary = "Create a Course", description = "Instructor creates a new course with name, hours, and description.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Course created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid payload or validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Course name already exists")
    })
    public ResponseEntity<ApiResponse<CourseResponseDTO>> createCourse(
            @Valid @RequestBody CourseRequestDTO requestDTO) {
        CourseResponseDTO created = courseService.createCourse(requestDTO);
        return new ResponseEntity<>(
                ApiResponse.success(created, "Course created successfully"),
                HttpStatus.CREATED
        );
    }

    /**
     * --------------------------------------------------------------------------
     * 2. GET ALL COURSES
     * --------------------------------------------------------------------------
     * HTTP Method: GET
     * URL: /api/v1/courses
     * Purpose: Retrieves all courses with optional filters (instructorId, category).
     */
    @GetMapping
    @Operation(summary = "Get All Courses", description = "Retrieves all courses with optional instructor or category filtering.")
    public ResponseEntity<ApiResponse<List<CourseResponseDTO>>> getAllCourses(
            @Parameter(description = "Filter by Instructor ID") @RequestParam(required = false) Long instructorId,
            @Parameter(description = "Filter by Category") @RequestParam(required = false) String category) {
        List<CourseResponseDTO> courses = courseService.getAllCourses(instructorId, category);
        return ResponseEntity.ok(ApiResponse.success(courses, "Retrieved " + courses.size() + " course(s)"));
    }

    /**
     * --------------------------------------------------------------------------
     * 3. GET COURSE BY ID
     * --------------------------------------------------------------------------
     * HTTP Method: GET
     * URL: /api/v1/courses/{id}
     * Purpose: Returns details of a specific course by its unique ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Course by ID", description = "Fetches complete details for a single course.")
    public ResponseEntity<ApiResponse<CourseResponseDTO>> getCourseById(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        CourseResponseDTO course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course, "Course retrieved successfully"));
    }

    /**
     * --------------------------------------------------------------------------
     * 4. UPDATE COURSE
     * --------------------------------------------------------------------------
     * HTTP Method: PUT
     * URL: /api/v1/courses/{id}
     * Role: INSTRUCTOR
     * Purpose: Modifies name, hours, description, or category of an existing course.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update Course", description = "Updates attributes of an existing course.")
    public ResponseEntity<ApiResponse<CourseResponseDTO>> updateCourse(
            @Parameter(description = "Course ID") @PathVariable Long id,
            @Valid @RequestBody CourseRequestDTO requestDTO) {
        CourseResponseDTO updated = courseService.updateCourse(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(updated, "Course updated successfully"));
    }

    /**
     * --------------------------------------------------------------------------
     * 5. DELETE COURSE
     * --------------------------------------------------------------------------
     * HTTP Method: DELETE
     * URL: /api/v1/courses/{id}
     * Role: INSTRUCTOR
     * Purpose: Deletes a course along with its activities.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Course", description = "Removes a course and cascading activities.")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @Parameter(description = "Course ID") @PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course with ID " + id + " deleted successfully"));
    }

    /**
     * --------------------------------------------------------------------------
     * 6. ADD ACTIVITY TO COURSE
     * --------------------------------------------------------------------------
     * HTTP Method: POST
     * URL: /api/v1/courses/{courseId}/activities
     * Role: INSTRUCTOR
     * Purpose: Adds a new learning activity (video, reading, assignment, quiz) to a course.
     */
    @PostMapping("/{courseId}/activities")
    @Operation(summary = "Add Activity to Course", description = "Appends a lesson, video, reading, quiz, or assignment activity to a course.")
    public ResponseEntity<ApiResponse<ActivityResponseDTO>> addActivity(
            @Parameter(description = "Course ID") @PathVariable Long courseId,
            @Valid @RequestBody ActivityRequestDTO requestDTO) {
        ActivityResponseDTO activity = courseService.addActivity(courseId, requestDTO);
        return new ResponseEntity<>(
                ApiResponse.success(activity, "Activity added to course successfully"),
                HttpStatus.CREATED
        );
    }

    /**
     * --------------------------------------------------------------------------
     * 7. GET ACTIVITIES OF A COURSE
     * --------------------------------------------------------------------------
     * HTTP Method: GET
     * URL: /api/v1/courses/{courseId}/activities
     * Purpose: Retrieves all ordered activities belonging to a course.
     */
    @GetMapping("/{courseId}/activities")
    @Operation(summary = "Get Course Activities", description = "Returns the sequential list of activities inside a course.")
    public ResponseEntity<ApiResponse<List<ActivityResponseDTO>>> getCourseActivities(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        List<ActivityResponseDTO> activities = courseService.getCourseActivities(courseId);
        return ResponseEntity.ok(ApiResponse.success(activities, "Retrieved " + activities.size() + " activity(ies)"));
    }

    /**
     * --------------------------------------------------------------------------
     * 8. UPDATE ACTIVITY
     * --------------------------------------------------------------------------
     * HTTP Method: PUT
     * URL: /api/v1/courses/activities/{activityId}
     * Role: INSTRUCTOR
     * Purpose: Updates activity details, duration, type, or learning content.
     */
    @PutMapping("/activities/{activityId}")
    @Operation(summary = "Update Activity", description = "Modifies an existing activity's title, description, or content.")
    public ResponseEntity<ApiResponse<ActivityResponseDTO>> updateActivity(
            @Parameter(description = "Activity ID") @PathVariable Long activityId,
            @Valid @RequestBody ActivityRequestDTO requestDTO) {
        ActivityResponseDTO updated = courseService.updateActivity(activityId, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(updated, "Activity updated successfully"));
    }

    /**
     * --------------------------------------------------------------------------
     * 9. DELETE ACTIVITY
     * --------------------------------------------------------------------------
     * HTTP Method: DELETE
     * URL: /api/v1/courses/activities/{activityId}
     * Role: INSTRUCTOR
     * Purpose: Deletes an activity from a course.
     */
    @DeleteMapping("/activities/{activityId}")
    @Operation(summary = "Delete Activity", description = "Removes an activity from its course.")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(
            @Parameter(description = "Activity ID") @PathVariable Long activityId) {
        courseService.deleteActivity(activityId);
        return ResponseEntity.ok(ApiResponse.success("Activity deleted successfully"));
    }
}
