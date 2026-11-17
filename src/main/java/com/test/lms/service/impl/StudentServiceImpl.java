package com.test.lms.service.impl;

import com.test.lms.dto.ActivityResponseDTO;
import com.test.lms.dto.CourseLearningDTO;
import com.test.lms.dto.StudentProgressDTO;
import com.test.lms.entity.*;
import com.test.lms.exception.ResourceNotFoundException;
import com.test.lms.repository.*;
import com.test.lms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ActivityRepository activityRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ActivityProgressRepository activityProgressRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentProgressDTO> getEnrolledCourses(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<StudentProgressDTO> results = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();
            long totalActivities = activityRepository.countByCourseId(course.getId());
            long completedActivities = activityProgressRepository
                    .countByStudentIdAndCourseIdAndIsCompletedTrue(studentId, course.getId());

            double percentage = totalActivities == 0 ? 0.0 :
                    Math.round(((double) completedActivities / totalActivities) * 1000.0) / 10.0;

            results.add(StudentProgressDTO.builder()
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

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public CourseLearningDTO getCourseLearningRoom(Long studentId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new IllegalArgumentException("Student is not enrolled in this course"));

        List<Activity> activities = activityRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        List<ActivityProgress> userProgress = activityProgressRepository.findByStudentIdAndCourseId(studentId, courseId);

        Set<Long> completedActivityIds = userProgress.stream()
                .filter(ap -> Boolean.TRUE.equals(ap.getIsCompleted()))
                .map(ap -> ap.getActivity().getId())
                .collect(Collectors.toSet());

        List<ActivityResponseDTO> activityDTOs = activities.stream().map(a -> ActivityResponseDTO.builder()
                .id(a.getId())
                .courseId(course.getId())
                .courseName(course.getName())
                .title(a.getTitle())
                .description(a.getDescription())
                .activityType(a.getActivityType())
                .durationMinutes(a.getDurationMinutes())
                .orderIndex(a.getOrderIndex())
                .content(a.getContent())
                .isCompleted(completedActivityIds.contains(a.getId()))
                .createdAt(a.getCreatedAt())
                .build()
        ).collect(Collectors.toList());

        long totalActivities = activities.size();
        long completedActivities = completedActivityIds.size();
        double percentage = totalActivities == 0 ? 0.0 :
                Math.round(((double) completedActivities / totalActivities) * 1000.0) / 10.0;

        return CourseLearningDTO.builder()
                .courseId(course.getId())
                .courseName(course.getName())
                .description(course.getDescription())
                .hours(course.getHours())
                .category(course.getCategory())
                .instructorName(course.getInstructorName())
                .totalActivities(totalActivities)
                .completedActivities(completedActivities)
                .progressPercentage(percentage)
                .isFullyCompleted(totalActivities > 0 && completedActivities == totalActivities)
                .activities(activityDTOs)
                .build();
    }

    @Override
    @Transactional
    public void completeActivity(Long studentId, Long activityId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        Course course = activity.getCourse();

        // Verify enrollment
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, course.getId())
                .orElseThrow(() -> new IllegalArgumentException("Student is not enrolled in this course"));

        // Fetch or create ActivityProgress
        ActivityProgress progress = activityProgressRepository
                .findByStudentIdAndActivityId(studentId, activityId)
                .orElseGet(() -> ActivityProgress.builder()
                        .student(student)
                        .activity(activity)
                        .course(course)
                        .build());

        progress.setIsCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        activityProgressRepository.save(progress);

        // Check if all activities are now complete
        long totalActivities = activityRepository.countByCourseId(course.getId());
        long completedCount = activityProgressRepository
                .countByStudentIdAndCourseIdAndIsCompletedTrue(studentId, course.getId());

        if (totalActivities > 0 && completedCount >= totalActivities) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollmentRepository.save(enrollment);
        }
    }
}
