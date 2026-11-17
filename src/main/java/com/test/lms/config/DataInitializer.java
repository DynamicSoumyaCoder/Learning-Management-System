package com.test.lms.config;

import com.test.lms.entity.*;
import com.test.lms.repository.*;
import com.test.lms.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Initializes default demo data (Instructor, Course, and Activities) on application startup
 * if the database is currently empty.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ActivityRepository activityRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("--- Initializing default LMS demo data ---");

            // 1. Create Default Instructor
            User instructor = User.builder()
                    .name("Prof. Alan Turing")
                    .email("instructor@lms.com")
                    .password(PasswordUtil.hashPassword("admin123"))
                    .phone("+1 555-0199")
                    .bio("Computer Science & Backend Engineering Specialist")
                    .role(Role.INSTRUCTOR)
                    .isFirstLogin(false)
                    .build();
            User savedInstructor = userRepository.save(instructor);
            log.info("Created Default Instructor: instructor@lms.com / admin123");

            // 2. Create Starter Course
            Course course = Course.builder()
                    .name("Full Stack Java & React LMS Bootcamp")
                    .hours(40.0)
                    .category("Software Engineering")
                    .description("Master modern backend architecture with Spring Boot 3, MySQL, and full-stack React integration.")
                    .instructor(savedInstructor)
                    .instructorName(savedInstructor.getName())
                    .active(true)
                    .build();
            Course savedCourse = courseRepository.save(course);

            // 3. Create Sample Activities
            Activity act1 = Activity.builder()
                    .course(savedCourse)
                    .title("Module 1: Spring Boot Architecture & MySQL Configuration")
                    .description("Learn layered architecture, Entity-DTO mappings, HikariCP, and JPA repositories.")
                    .activityType(ActivityType.VIDEO)
                    .durationMinutes(45)
                    .orderIndex(1)
                    .content("https://www.youtube.com/watch?v=sample-video-link")
                    .build();

            Activity act2 = Activity.builder()
                    .course(savedCourse)
                    .title("Module 2: RESTful API Design & Validation")
                    .description("Deep dive into @RestController, Bean Validation, and centralized exception handling.")
                    .activityType(ActivityType.READING)
                    .durationMinutes(30)
                    .orderIndex(2)
                    .content("Review documentation on Spring Data JPA queries, DTO patterns, and Swagger OpenAPI integration.")
                    .build();

            Activity act3 = Activity.builder()
                    .course(savedCourse)
                    .title("Assignment 1: Build a Student Onboarding Workflow")
                    .description("Implement instructor student creation with temporary passwords and first-login password update.")
                    .activityType(ActivityType.ASSIGNMENT)
                    .durationMinutes(60)
                    .orderIndex(3)
                    .content("Submit a working React form connected to POST /api/v1/instructor/students.")
                    .build();

            activityRepository.saveAll(List.of(act1, act2, act3));
            log.info("Created Demo Course with 3 Activities for instructor: {}", savedInstructor.getName());
        }
    }
}
