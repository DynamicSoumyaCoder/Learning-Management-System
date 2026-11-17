package com.test.lms.service.impl;

import com.test.lms.dto.EnrollmentRequestDTO;
import com.test.lms.dto.StudentCreateDTO;
import com.test.lms.dto.StudentProgressDTO;
import com.test.lms.dto.StudentResponseDTO;
import com.test.lms.entity.*;
import com.test.lms.exception.DuplicateResourceException;
import com.test.lms.exception.ResourceNotFoundException;
import com.test.lms.repository.*;
import com.test.lms.service.InstructorService;
import com.test.lms.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ActivityRepository activityRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ActivityProgressRepository activityProgressRepository;

    @Override
    @Transactional
    public StudentResponseDTO addStudent(StudentCreateDTO requestDTO) {
        String email = requestDTO.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("A student with email '" + email + "' already exists");
        }

        User student = User.builder()
                .name(requestDTO.getName().trim())
                .email(email)
                .password(PasswordUtil.hashPassword(requestDTO.getDefaultPassword()))
                .phone(requestDTO.getPhone() != null ? requestDTO.getPhone().trim() : null)
                .bio(requestDTO.getBio() != null ? requestDTO.getBio().trim() : null)
                .role(Role.STUDENT)
                .isFirstLogin(true) // Student MUST change password on first login
                .build();

        User saved = userRepository.save(student);

        return StudentResponseDTO.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .bio(saved.getBio())
                .isFirstLogin(saved.getIsFirstLogin())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT).stream()
                .map(student -> StudentResponseDTO.builder()
                        .id(student.getId())
                        .name(student.getName())
                        .email(student.getEmail())
                        .phone(student.getPhone())
                        .bio(student.getBio())
                        .isFirstLogin(student.getIsFirstLogin())
                        .createdAt(student.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void enrollStudent(EnrollmentRequestDTO requestDTO) {
        User student = userRepository.findById(requestDTO.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", requestDTO.getStudentId()));

        if (student.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException("Target user is not a student");
        }

        Course course = courseRepository.findById(requestDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", requestDTO.getCourseId()));

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new DuplicateResourceException("Student is already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .status(EnrollmentStatus.ACTIVE)
                .build();

        enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public void unenrollStudent(Long studentId, Long courseId) {
        enrollmentRepository.deleteByStudentIdAndCourseId(studentId, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentProgressDTO> getInstructorDashboardProgress(Long instructorId) {
        List<Enrollment> enrollments;
        if (instructorId != null) {
            List<Course> instructorCourses = courseRepository.findByInstructorId(instructorId);
            List<Long> courseIds = instructorCourses.stream().map(Course::getId).toList();
            enrollments = enrollmentRepository.findAll().stream()
                    .filter(e -> courseIds.contains(e.getCourse().getId()))
                    .toList();
        } else {
            enrollments = enrollmentRepository.findAll();
        }

        List<StudentProgressDTO> progressList = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            User student = enrollment.getStudent();
            Course course = enrollment.getCourse();

            long totalActivities = activityRepository.countByCourseId(course.getId());
            long completedActivities = activityProgressRepository
                    .countByStudentIdAndCourseIdAndIsCompletedTrue(student.getId(), course.getId());

            double percentage = totalActivities == 0 ? 0.0 :
                    Math.round(((double) completedActivities / totalActivities) * 1000.0) / 10.0;

            progressList.add(StudentProgressDTO.builder()
                    .studentId(student.getId())
                    .studentName(student.getName())
                    .studentEmail(student.getEmail())
                    .studentPhone(student.getPhone())
                    .courseId(course.getId())
                    .courseName(course.getName())
                    .courseHours(course.getHours())
                    .totalActivities(totalActivities)
                    .completedActivities(completedActivities)
                    .progressPercentage(percentage)
                    .enrollmentStatus(enrollment.getStatus())
                    .enrolledAt(enrollment.getEnrolledAt())
                    .build());
        }

        return progressList;
    }
}
